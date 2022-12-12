import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterDTO } from './dto/user-register.dto';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserLoginDTO } from './dto/user-login.dto';
// import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerUser(userRegisterDTO: UserRegisterDTO): Promise<void> {
    const { email, nickname, password, phoneNumber } = userRegisterDTO;
    // const imgName = process.env.AWS_S3_STORAGE_URL + imgUrl.key;
    // userRegisterDTO.profileImg = imgName;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new UnauthorizedException('이메일이 이미 존재합니다.');
    }
    const nick = await this.userRepository.findOne({ where: { nickname } });
    if (nick) {
      throw new UnauthorizedException('닉네임이 이미 존재합니다.');
    }
    // 프론트에서 처리
    // if (password !== confirm) {
    //   throw new UnauthorizedException(
    //     '비밀번호가 비밀번호 확인과 일치하지 않습니다',
    //   );
    // }
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.save({
      ...userRegisterDTO,
      password: hashedPassword,
    });
  }

  async getNickname(nickname: string) {
    const nick = await this.userRepository.findOne({ where: { nickname } });
    if (nick) {
      return { success: false };
    } else {
      return { success: true };
    }
  }

  async verifyUserAndSignJwt(
    email: UserLoginDTO['email'],
    password: UserLoginDTO['password'],
  ): Promise<{ jwt: string; refreshToken: string; nickname: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user)
      throw new UnauthorizedException('해당하는 이메일은 존재하지 않습니다.');
    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('로그인에 실패하였습니다.');
    try {
      // const payload = { email };
      // const jwt = await this.jwtService.sign(payload, {
      //   secret: this.configService.get('SECRET_KEY'),
      // });
      const jwt = await this.makeAccessToken(user.email);
      const refreshToken = await this.makeRefreshToken(user.email);
      const nickname = user.nickname;
      await this.CurrnetRefreshToken(refreshToken, user.userId);
      return { jwt, refreshToken, nickname };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async editNickname(nickname: string, userId) {
    await this.userRepository.update(userId, { nickname });
  }

  async editPassword(userUpdateDTO, userId) {
    if (userUpdateDTO.password !== userUpdateDTO.confirmPassword) {
      throw new BadRequestException('비밀번호가 비밀번호 확인과 다릅니다.');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userUpdateDTO.password, salt);
    await this.userRepository.update(userId, { password: hashedPassword });
  }

  async updateUserImg(imgObject, userId) {
    const profileImg = process.env.AWS_S3_STORAGE_URL + imgObject.key;
    await this.userRepository.update(userId, { profileImg });
  }

  async findUserById(userId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { userId },
      });
      if (!user) throw new Error();
      return user;
    } catch (error) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async deleteUser(user) {
    const deleteuser = await this.userRepository.delete({
      userId: user.userId,
    });
    // if (deleteuser.affected === 0) {
    //   throw new NotFoundException('회원 탈퇴에 실패했습니다.');
    // }
    return { success: true, message: '회원탈퇴 완료' };
  }

  async kakaoCallback(query) {
    const data = {
      code: query,
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_ID,
      redirect_uri: process.env.KAKAO_REDIRECT_URI,
      // redirect_uri: 'http://localhost:3000/user/kakao/callback',
      // client_secret: process.env.SECRET_KEY,
    };

    const queryStringBody = Object.keys(data)
      .map((k) => encodeURIComponent(k) + '=' + encodeURI(data[k]))
      .join('&');
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const response = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      queryStringBody,
      config,
    );
    const { access_token } = response.data;
    // const access_token = query;
    const getUserUrl = 'https://kapi.kakao.com/v2/user/me';
    const response2 = await axios({
      method: 'get',
      url: getUserUrl,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const userdata = response2.data;
    // const email = 'whtkdgusdldi@naver.com';
    const email = userdata.kakao_account.email;
    const nickname = userdata.properties.nickname;
    // const profileImg = userdata.properties.image_url;
    const user = await this.findUserByEmail(email);
    const accessToken = await this.makeAccessToken(email);
    const refreshToken = await this.makeRefreshToken(email);
    if (user) {
      await this.CurrnetRefreshToken(refreshToken, user['id']);
      return {
        accessToken,
        refreshToken,
      };
    } else {
      const newUser = await this.userRepository.save(
        email,
        nickname,
        // profileImg: profileImg,
      );
      // await this.CurrnetRefreshToken(refreshToken, newUser);
      return {
        accessToken,
        refreshToken,
      };
    }
  }

  async kakaoSignin() {
    const data = {
      KAKAO_ID: process.env.KAKAO_KEY,
      KAKAO_REDIRECT_URI: process.env.KAKAO_CALLBACK_URL,
      // KAKAO_REDIRECT_URI: 'http://localhost:3000/user/kakao/callback',
    };
    return data;
  }

  async makeAccessToken(email) {
    const payload = { email };
    const accessToken = await this.jwtService.sign(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: '1d',
    });
    return accessToken;
  }
  async makeRefreshToken(email) {
    const payload = { email };
    const refreshToken = await this.jwtService.sign(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: '15d',
    });
    return refreshToken;
  }
  async CurrnetRefreshToken(refreshToken: string, id: number) {
    const salt = await bcrypt.genSalt();
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    await this.userRepository.update(id, { currentHashedRefreshToken });
  }
}
