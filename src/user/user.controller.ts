import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { UserLoginDTO } from './dto/user-login.dto';
import { UserRegisterDTO } from './dto/user-register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { Repository } from 'typeorm';
import { OnlyPrivateInterceptor } from '../common/interceptor/only-private.interceptor';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { UserDTO } from './dto/user.dto';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws.service';
// import multer from 'multer';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly usersService: UserService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly awsService: AwsService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(OnlyPrivateInterceptor)
  async getCurrentUser(@CurrentUser() currentUser: UserDTO) {
    return currentUser;
  }

  @UseInterceptors(FileInterceptor('profileImg'))
  @Post('signup')
  async signUp(
    @Body() userRegisterDTO: UserRegisterDTO,
    @UploadedFile() profileImg: Express.Multer.File,
  ) {
    const { key } = await this.awsService.uploadFileToS3('users', profileImg);
    return await this.usersService.registerUser(userRegisterDTO, key);
  }

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

  // @UseInterceptors(FileInterceptor('profileImg'))
  // @UseGuards(JwtAuthGuard)
  // @Post('upload')
  // async uploadprofileImg(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  //   return await this.awsService.uploadFileToS3('users', file);
  // }

  @Post('logout')
  async logOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
  }
}
