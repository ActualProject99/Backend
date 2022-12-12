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
import { nextTick } from 'process';
import { SMS } from './dto/sms.dto';
// import { getConnection } from 'typeorm';

const ACCESS_KEY_ID = `pimkrwCJBeVFBwSa4nIz`;
const SECRET_KEY = `BrMR73WfGFm1iAGP08Zbv4tc3LeId0I5zf0HjTkT`;
const SMS_SERVICE_ID = `ncp:sms:kr:295832057979:tgle`;

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

    // const refresh_token = CryptoJS.AES.encrypt(
    //   JSON.stringify(token),
    //   process.env.AES_KEY,
    // ).toString();

    // await getConnection()
    //   .createQueryBuilder()
    //   .update(User)
    //   .set({ refresh_token: token })
    //   .where(`userId = ${user.userId}`)
    //   .execute();
    // return refresh_token;
  }

  async onceToken(user_profile: any) {
    const payload = {
      email: user_profile.email,
      nickname: user_profile.nickname,
      profileImg: user_profile.profileImg,
      user_token: 'onceToken',
    };

    return this.jwtService.sign(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: '10m',
    });
  }

  // tokenValidate(token: string) {
  //   return await this.jwtService.verify(token, {
  //     secret: process.env.SECRET_KEY,
  //   });
  // }

  // SMS 인증 위한 시그니쳐 생성 로직
  makeSignitureForSMS = (): string => {
    const message = [];
    const hmac = crypto.createHmac('sha256', SECRET_KEY);
    const timeStamp = Date.now().toString();
    const space = ' ';
    const newLine = '\n';
    const method = 'POST';

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
  sendSMS = async (phoneNumber: string) => {
    // 캐시에 있던 데이터 삭제
    await this.cacheManager.del(phoneNumber);
    // 난수 생성 (4자리로 고정)
    const checkNumber = this.makeRand6Num().toString().padStart(4, '0');

    // 바디 제작
    const body = {
      type: 'SMS',
      contentType: 'COMM',
      countryCode: '82',
      from: '01028986394',
      content: `인증번호는 ${checkNumber}`,
      messages: [
        {
          to: `${phoneNumber}`, // 수신자 번호
        },
      ],
    };
    // 헤더 제작
    const options = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-ncp-apigw-timestamp': Date.now().toString(),
        'x-ncp-iam-access-key': ACCESS_KEY_ID,
        'x-ncp-apigw-signature-v2': this.makeSignitureForSMS(),
      },
    };
    console.log(body, options, Date.now().toString());

    // 문자 보내기 (url)
    axios
      .post(
        `https://sens.apigw.ntruss.com/sms/v2/services/${SMS_SERVICE_ID}/messages`,
        options,
        // body,
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
  };

  // // SMS 확인 로직, 문자인증은 3분 이내에 입력해야지 가능합니다!
  checkSMS = async (
    phoneNumber: string,
    inputNumber: string,
  ): Promise<boolean> => {
    const sentNumber = (await this.cacheManager.get(phoneNumber)) as string;
    if (sentNumber === inputNumber) return true;
    else return false;
  };

  // private makeSignature(): string {
  //   const message = [];
  //   const hmac = crypto.createHmac('sha256', SECRET_KEY);
  //   const space = ' ';
  //   const newLine = '\n';
  //   const method = 'POST';
  //   const timestamp = Date.now().toString();
  //   message.push(method);
  //   message.push(space);
  //   message.push(`/sms/v2/services/${SMS_SERVICE_ID}/messages`);
  //   message.push(newLine);
  //   message.push(timestamp);
  //   message.push(newLine);
  //   message.push(ACCESS_KEY_ID);
  //message 배열에 위의 내용들을 담아준 후에
  // const signature = message.join('');
  // const signiture = hmac.update(message.join('')).digest('base64');
  //message.join('') 으로 만들어진 string 을 hmac 에 담고, base64로 인코딩한다
  // return signiture.toString(); // toString()이 없었어서 에러가 자꾸 났었는데, 반드시 고쳐야함.
  // }

  // async sendSMS(phoneNumber: string) {
  //   const checkNumber = this.makeRand6Num().toString().padStart(6, '0');

  //   const body = {
  //     type: 'SMS',
  //     contentType: 'COMM',
  //     countryCode: '82',
  // from: this.config.get('hostPhoneNumber'), // 발신자 번호
  // from: '01028986394',
  // content: `인증번호는 ${checkNumber} 입니다.`,
  // content: `문자 내용 부분 입니다.`,
  //   messages: [
  //     {
  //       to: `${phoneNumber}`, // 수신자 번호
  //     },
  //   ],
  // };
  // console.log(phoneNumber, SMS_SERVICE_ID);

  // const options = {
  //   headers: {
  //     'Content-Type': 'application/json; charset=utf-8',
  //     'x-ncp-iam-access-key': ACCESS_KEY_ID,
  //     'x-ncp-apigw-timestamp': Date.now().toString(),
  //     'x-ncp-apigw-signature-v2': this.makeSignature(),
  //   },
  // };

  // 헤더 제작
  // headers = {
  //   'Content-Type': 'application/json; charset=utf-8',
  //   'x-ncp-apigw-timestamp': Date.now().toString(),
  //   'x-ncp-iam-access-key': ACCESS_KEY_ID,
  //   'x-ncp-apigw-signature-v2': this.makeSignature(),
  // };
  // axios
  //   .post(
  //     `https://sens.apigw.ntruss.com/sms/v2/services/${SMS_SERVICE_ID}/messages`,
  //     body,
  //     options,
  //   )
  //   .then(async (res) => {
  //     // 성공 이벤트
  //   })
  //   .catch((err) => {
  //     // console.error(err.response.data);
  //     throw new InternalServerErrorException();
  //   });

  //   return axios
  //     .post(
  //       `https://sens.apigw.ntruss.com/sms/v2/services/${SMS_SERVICE_ID}/messages`,
  //       { body },
  //       { headers },
  //     )
  //     .catch(async (e) => {
  //       // 에러일 경우 반환값
  //       // console.log(JSON(e));
  //       throw new InternalServerErrorException();
  //     })
  //     .finally(() => {
  //       this.cacheManager.set(phoneNumber, checkNumber);
  //     });
  // }
}
