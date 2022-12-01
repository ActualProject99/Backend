import {
  BadRequestException,
  Injectable,
  Logger,
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
import { UserDTO } from './dto/user.dto';

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
      // imgName,
      password: hashedPassword,
    });
  }

  async verifyUserAndSignJwt(
    email: UserLoginDTO['email'],
    password: UserLoginDTO['password'],
  ): Promise<{ jwt: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user)
      throw new UnauthorizedException('해당하는 이메일은 존재하지 않습니다.');
    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('로그인에 실패하였습니다.');
    try {
      const payload = { email };
      const jwt = await this.jwtService.sign(payload, {
        secret: this.configService.get('SECRET_KEY'),
      });
      return { jwt };
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
}
