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
import { UserEntity } from '../enties/user.entity';
import * as bcrypt from 'bcrypt';
import { UserLoginDTO } from './dto/user-login.dto';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerUser(
    userRegisterDTO: UserRegisterDTO,
    key: string,
  ): Promise<void> {
    const { email, nickname, name, password } = userRegisterDTO;
    const imgName = process.env.AWS_S3_STORAGE_URL + key;
    userRegisterDTO.profileImg = imgName;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new UnauthorizedException('이메일이 이미 존재합니다.');
    }
    const nick = await this.userRepository.findOne({ where: { nickname } });
    if (nick) {
      throw new UnauthorizedException('닉네임이 이미 존재합니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.save({
      ...userRegisterDTO,
      imgName,
      password: hashedPassword,
    });
  }

  // async uploadImg(currentUser: UserDTO, file: Express.Multer.File) {
  //   const fileName = `users/${file[0].filename}`;

  //   console.log(fileName);

  //   const user = await this.userRepository.findByIdAndUpdateImg({
  //     currentUser.userId,
  //     fileName
  //   });
  //   console.log(user);
  //   return user;
  // }

  async verifyUserAndSignJwt(
    email: UserLoginDTO['email'],
    password: UserLoginDTO['password'],
  ): Promise<{ jwt: string; user: UserDTO }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user)
      throw new UnauthorizedException('해당하는 이메일은 존재하지 않습니다.');
    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('로그인에 실패하였습니다.');
    try {
      const jwt = await this.jwtService.signAsync(
        { sub: user.userId },
        { secret: this.configService.get('SECRET_KEY') },
      );
      return { jwt, user };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
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
}
