import {
  CacheInterceptor,
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as crypto from 'crypto';
import axios from 'axios';
import { Cache } from 'cache-manager';

const ACCESS_KEY_ID = process.env.NAVER_ACCESS_KEY_ID;
const SECRET_KEY = process.env.NAVER_SECRET_KEY;
const SMS_SERVICE_ID = process.env.NAVER_SMS_SERVICE_ID;

@Injectable()
@UseInterceptors(CacheInterceptor)
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string): Promise<any> {
    const user = this.usersService.findUserByEmail(email);
    if (!user) {
      return null;
    }
    return user;
  }

  async createLoginToken(user: User) {
    const payload = {
      email: user.email,
      user_token: 'loginToken',
    };

    return this.jwtService.sign(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: '10m',
    });
  }

  async createRefreshToken(user: User) {
    const payload = {
      userId: user.userId,
      user_token: 'refreshToken',
    };

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: '50m',
    });

    return refresh_token;
  }

  // SMS 인증 위한 시그니쳐 생성 로직
  makeSignitureForSMS = (): string => {
    const message = [];
    const hmac = crypto.createHmac('sha256', SECRET_KEY);
    const space = ' ';
    const newLine = '\n';
    const method = 'POST';
    const timeStamp = Date.now().toString();

    message.push(method);
    message.push(space);
    message.push(`/sms/v2/services/${SMS_SERVICE_ID}/messages`);
    message.push(newLine);
    message.push(timeStamp);
    message.push(newLine);
    message.push(ACCESS_KEY_ID);
    // 시그니쳐 생성
    const signiture = hmac.update(message.join('')).digest('base64');
    // string 으로 반환
    return signiture.toString();
  };

  // 무작위 4자리 랜덤 번호 생성하기
  makeRand6Num = (): number => {
    const randNum = Math.floor(Math.random() * 10000);
    return randNum;
  };

  // SMS 발송 로직
  async sendSMS(phoneNumber: string) {
    console.log(SECRET_KEY, ACCESS_KEY_ID);
    // 캐시에 있던 데이터 삭제
    await this.cacheManager.del(phoneNumber);
    // 난수 생성 (4자리로 고정)
    const checkNumber = this.makeRand6Num().toString().padStart(4, '0');
    const phone = phoneNumber['phoneNumber'];

    // 바디 제작
    const body = {
      type: 'SMS',
      contentType: 'COMM',
      countryCode: '82',
      from: '01028986394',
      content: `인증번호는 ${checkNumber} 입니다.`,
      messages: [
        {
          to: phone, // 수신자 번호
          title: '제목없음',
          // content: `인증번호는 ${checkNumber} 입니다.`,
        },
      ],
    };
    // 헤더 제작
    const options = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-ncp-apigw-timestamp': Date.now().toString(),
        'x-ncp-iam-access-key': 'pimkrwCJBeVFBwSa4nIz',
        'x-ncp-apigw-signature-v2': this.makeSignitureForSMS(),
      },
    };
    console.log(body, options);

    // 문자 보내기 (url)
    axios
      .post(
        `https://sens.apigw.ntruss.com/sms/v2/services/${SMS_SERVICE_ID}/messages`,
        body,
        options,
      )
      .then(async (res) => {
        // 성공 이벤트
        return '성공!';
      })
      .catch((err) => {
        console.error(err.response.data);
        throw new InternalServerErrorException();
      });
    // 캐시 추가하기
    await this.cacheManager.set(phoneNumber, checkNumber);
    return 'send end!';
  }

  // // SMS 확인 로직, 문자인증은 3분 이내에 입력해야지 가능합니다!
  checkSMS = async (
    phoneNumber: string,
    inputNumber: string,
  ): Promise<boolean> => {
    const sentNumber = (await this.cacheManager.get(phoneNumber)) as string;
    if (sentNumber === inputNumber) return true;
    else return false;
  };
}
