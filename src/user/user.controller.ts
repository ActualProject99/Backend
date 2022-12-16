import {
  Body,
  Controller,
  Delete,
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
import { ArtistLike } from 'src/entities/artist_like.entity';
import { ArtistlikeService } from 'src/artist_like/artist_like.service';

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
  // @UseInterceptors(FileInterceptor('profileImg'))
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

  // 유저 닉네임 중복검사
  @Get('signup')
  @ApiTags('users')
  async getNickname(@Req() req) {
    return await this.usersService.getNickname(req.query.nickname);
  }

  // 휴대전화 인증구현
  @Post('signup/phonenumber')
  @ApiTags('users')
  async confirmPhone(@Body() phoneNumber: string) {
    return await this.authService.sendSMS(phoneNumber);
    // return checkNumber;
  }

  @Post('signup/verifyNum')
  @ApiTags('users')
  async verifyNumber(@Body() phoneNumber: string, inputNumber: string) {
    return await this.authService.checkSMS(phoneNumber, inputNumber);
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
  async logIn(
    @Request() req: any,
    @Body() userLoginDTO: UserLoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token, refresh_token, nickname } =
      await this.usersService.verifyUserAndSignJwt(
        userLoginDTO.email,
        userLoginDTO.password,
      );
    response.cookie('access_token', access_token);
    response.cookie('refreshToken', refresh_token);
    return { access_token, refresh_token, nickname };
  }

  // @ApiOperation({
  //   summary: '카카오 로그인',
  //   description: '카카오 로그인을 API',
  // })
  // @UseGuards(KakaoAuthGuard)
  // @Get('kakao')
  // @Redirect('http://localhost:3000/users/kakao/callback')
  // async kakaoLogin() {
  //   return HttpStatus.OK;
  // }

  @ApiOperation({
    summary: '카카오 로그인',
    description: '카카오 로그인을 API',
  })
  @Post('kakao')
  async kakaoLogin(@Req() req, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.usersService.kakaoLogin(
      req.headers.authorization,
    );
    res.cookie('accessToken', accessToken);
    res.cookie('refreshToken', refreshToken);
    res.status(200).json({
      message: '로그인 성공',
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }

  // //카카오 콜벡
  // @Get('/kakao/callback')
  // @ApiTags('users')
  // @Redirect('https://tgle.ml/concert')
  // async kakaoCallback(@Query() query, @Res() res) {
  //   const { accessToken, refreshToken } = await this.usersService.kakaoCallback(
  //     query.code,
  //   );
  //   res.cookie('refreshToken', refreshToken);
  //   res.cookie('accessToken', accessToken);
  //   // res.session.token = { accessToken, refreshToken };
  //   // res.session.save();
  //   return {
  //     // accessToken,
  //     url: `https://tgle.ml/auth?accessToken=${accessToken}&refreshToken=${refreshToken}`,
  //   };
  // }

  // //카카오 인증요청
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
  async getCurrentUser(@Req() req) {
    const currentUser = await this.usersService.findUserByEmail(req.user.email);
    return currentUser;
  }

  // 유저 닉네임, 패스워드 수정
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
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  async updateUserInfo(@Req() req, @Body() userUpdateDTO: UserUpdateDTO) {
    if (userUpdateDTO.nickname) {
      this.usersService.editNickname(userUpdateDTO.nickname, req.user.userId);
    }
    if (userUpdateDTO.password && userUpdateDTO.confirmPassword) {
      this.usersService.editPassword(userUpdateDTO, req.user.userId);
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
    @Req() req,
  ) {
    // await this.awsService.deleteS3Object(currentUser.profileImg); //s3 이미지 삭제 수정요함
    const imgObject = await this.awsService.uploadFileToS3('users', profileImg);
    return await this.usersService.updateUserImg(imgObject, req.user.userId);
  }

  // 회원탈퇴
  @Delete('delete')
  @ApiTags('users')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Req() req): Promise<object> {
    return this.usersService.deleteUser(req.user);
  }

  // 유저 로그아웃
  @Post('logout')
  async logOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
  }
}
