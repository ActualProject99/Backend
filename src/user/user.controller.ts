import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Put,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { UserLoginDTO } from './dto/user-login.dto';
import { UserRegisterDTO } from './dto/user-register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { OnlyPrivateInterceptor } from '../common/interceptor/only-private.interceptor';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { UserDTO } from './dto/user.dto';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws.service';
import { UserUpdateDTO } from './dto/user-update.dto';
// import multer from 'multer';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly usersService: UserService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly awsService: AwsService,
  ) {}

  // 유저 회원가입
  @UseInterceptors(FileInterceptor('profileImg'))
  @Post('signup')
  async signUp(
    @Body() userRegisterDTO: UserRegisterDTO,
    @UploadedFile() profileImg: Express.Multer.File,
  ) {
    const imgUrl = await this.awsService.uploadFileToS3('users', profileImg);
    return await this.usersService.registerUser(userRegisterDTO, imgUrl);
  }

  // 유저 로그인
  @Post('login')
  async logIn(
    @Body() userLoginDTO: UserLoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { jwt, user } = await this.usersService.verifyUserAndSignJwt(
      userLoginDTO.email,
      userLoginDTO.password,
    );
    response.cookie('jwt', jwt, { httpOnly: true });
    return user;
  }

  // 유저 정보 불러오기
  @Get('userinfo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(OnlyPrivateInterceptor)
  async getCurrentUser(@CurrentUser() currentUser: UserDTO) {
    return currentUser;
  }

  // 유저 닉네임, 패스워드 수정
  @Put('userinfo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(OnlyPrivateInterceptor)
  async updateUserInfo(
    @Body() userUpdateDTO: UserUpdateDTO,
    @CurrentUser() currentUser: UserDTO,
  ) {
    if (userUpdateDTO.nickname) {
      this.usersService.editNickname(
        userUpdateDTO.nickname,
        currentUser.userId,
      );
    }
    if (userUpdateDTO.password && userUpdateDTO.confirmPassword) {
      this.usersService.editPassword(userUpdateDTO, currentUser.userId);
    }
    if (
      !userUpdateDTO.nickname &&
      !userUpdateDTO.password &&
      !userUpdateDTO.confirmPassword
    ) {
      throw new UnauthorizedException('입력된 값이 없습니다');
    }
    return { success: true, message: '수정성공' };
  }

  // 유저 프로필 이미지 업데이트
  @UseInterceptors(FileInterceptor('profileImg'))
  @Put('userinfo/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(OnlyPrivateInterceptor)
  async updateUserImg(
    @UploadedFile() profileImg: Express.Multer.File,
    @Body() userUpdateDTO: UserUpdateDTO,
    @CurrentUser() currentUser: UserDTO,
  ) {
    // await this.awsService.deleteS3Object(currentUser.profileImg); //s3 이미지 삭제 수정요함
    const imgObject = await this.awsService.uploadFileToS3('users', profileImg);
    return await this.usersService.updateUserImg(imgObject, currentUser.userId);
  }

  // @UseInterceptors(FileInterceptor('profileImg'))
  // @UseGuards(JwtAuthGuard)
  // @Post('upload')
  // async uploadprofileImg(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  //   return await this.awsService.uploadFileToS3('users', file);
  // }

  // 유저 로그아웃
  @Post('logout')
  async logOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
  }
}
