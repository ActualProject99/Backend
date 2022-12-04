import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Put,
  Query,
  Redirect,
  Req,
  Request,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { query, Response } from 'express';
import { UserService } from './user.service';
import { UserLoginDTO } from './dto/user-login.dto';
import { UserRegisterDTO } from './dto/user-register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { OnlyPrivateInterceptor } from '../common/interceptor/only-private.interceptor';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { UserDTO } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws.service';
import { UserUpdateDTO } from './dto/user-update.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { KakaoAuthGuard } from 'src/auth/guard/kakao.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly usersService: UserService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly awsService: AwsService,
    private readonly authService: AuthService,
  ) {}

  // 유저 회원가입
  @Post('signup')
  @UseInterceptors(FileInterceptor('profileImg'))
  @ApiTags('users')
  @ApiOperation({
    summary: '회원가입',
    description: '회원가입',
  })
  @ApiCreatedResponse({ description: '회원가입' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: UserDTO,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  // @UseGuards(JwtAuthGuard)
  async signUp(
    @Res({ passthrough: true }) response: Response,
    @Body() userRegisterDTO: UserRegisterDTO,
    // @UploadedFile() profileImg: Express.Multer.File,
  ) {
    // const imgUrl = await this.awsService.uploadFileToS3('users', profileImg);
    return await this.usersService.registerUser(userRegisterDTO);
  }

  // 유저 로그인
  @Post('login')
  @ApiTags('users')
  @ApiOperation({
    summary: '로그인',
    description: '로그인',
  })
  @ApiCreatedResponse({ description: '로그인' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: UserDTO,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @UseGuards(JwtAuthGuard)
  async logIn(
    @Request() req: any,
    @Body() userLoginDTO: UserLoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { jwt, nickname } = await this.usersService.verifyUserAndSignJwt(
      userLoginDTO.email,
      userLoginDTO.password,
    );
    // const user = await this.authService.validateUser(userLoginDTO.email);
    // const access_token = await this.authService.createLoginToken(user);
    // const refresh_token = await this.authService.createRefreshToken(user);

    // response.setHeader('access_token', access_token);
    // response.setHeader('refresh_token', refresh_token);
    // response.cookie('jwt', jwt, { httpOnly: true });
    response.cookie('jwt', jwt);
    response.setHeader('jwt', jwt);
    return { jwt, nickname };
  }

  @ApiOperation({
    summary: '카카오 로그인',
    description: '카카오 로그인을 API',
  })
  @UseGuards(KakaoAuthGuard)
  @Get('kakao')
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  //카카오 인증요청
  // @Get('/kakao')
  // @ApiTags('users')
  // @ApiOperation({
  //   summary: '카카오 로그인',
  //   description: '카카오 로그인',
  // })
  // @ApiOkResponse({ description: '카카오 로그인' })
  // @Redirect('https://kauth.kakao.com')
  // async kakakoSignin() {
  //   const { KAKAO_ID, KAKAO_REDIRECT_URI } =
  //     await this.usersService.kakaoSignin();
  //   return {
  //     url: `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`,
  //   };
  // }

  @ApiOperation({
    summary: '카카오 로그인 콜백',
    description: '카카오 로그인시 콜백 라우터입니다.',
  })
  @UseGuards(KakaoAuthGuard)
  // @Redirect('https://da5loh79xj553.cloudfront.net/')
  @Get('oauth/kakao/callback')
  async kakaocallback(@Req() req, @Res() res: Response) {
    // const { jwt, nickname } = await this.usersService.kakaoCallback(query.code);
    // return { jwt, nickname };
    const { jwt, nickname } = req.user;
    // console.log(jwt, nickname);
    // res.setHeader('jwt', jwt);
    // if (req.user.type === 'login') {
    //   res.setHeader('jwt', jwt);
    // res.cookie('refresh_token', req.user.refresh_token);
    // } else {
    //   res.cookie('jwt', jwt);
    // }
    res.redirect('https://da5loh79xj553.cloudfront.net/');
    res.end();
    return { jwt, nickname };
  }

  // 유저 정보 불러오기
  @ApiBearerAuth('jwt')
  @Get('userinfo')
  @ApiTags('users')
  @ApiOperation({
    summary: '회원정보',
    description: '회원정보',
  })
  @ApiCreatedResponse({ description: '회원정보' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: UserDTO,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @UseGuards(JwtAuthGuard)
  // @UseInterceptors(OnlyPrivateInterceptor)
  async getCurrentUser(@Req() req) {
    const currentUser = await this.usersService.findUserByEmail(req.user.email);
    return currentUser;
  }

  // 유저 닉네임, 패스워드 수정
  @ApiBearerAuth('jwt')
  @Put('userinfo')
  @ApiTags('users')
  @ApiOperation({
    summary: '회원정보 수정(닉네임, 비밀번호)',
    description: '회원정보 수정(닉네임, 비밀번호)',
  })
  @ApiCreatedResponse({ description: '회원정보' })
  @ApiBody({ type: UserUpdateDTO })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: UserDTO,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @UseGuards(JwtAuthGuard)
  // @UseInterceptors(OnlyPrivateInterceptor)
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
  @ApiBearerAuth('jwt')
  @UseInterceptors(FileInterceptor('profileImg'))
  @Put('userinfo/upload')
  @ApiTags('users')
  @ApiOperation({
    summary: '회원정보 수정(프로필사진)',
    description: '회원정보 수정(프로필사진)',
  })
  @ApiCreatedResponse({ description: '회원정보' })
  @ApiBody({ type: UserUpdateDTO })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: UserDTO,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @UseGuards(JwtAuthGuard)
  // @UseInterceptors(OnlyPrivateInterceptor)
  async updateUserImg(
    @UploadedFile() profileImg: Express.Multer.File,
    @Body() userUpdateDTO: UserUpdateDTO,
    @CurrentUser() currentUser: UserDTO,
  ) {
    // await this.awsService.deleteS3Object(currentUser.profileImg); //s3 이미지 삭제 수정요함
    const imgObject = await this.awsService.uploadFileToS3('users', profileImg);
    return await this.usersService.updateUserImg(imgObject, currentUser.userId);
  }

  // 유저 로그아웃
  @Post('logout')
  async logOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
  }
}
