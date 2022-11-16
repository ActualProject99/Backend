import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserEntity } from '../models/user.entity';

export class UserRegisterDTO extends PickType(UserEntity, [
  'email',
  'profileImg',
  'nickname',
  'name',
  'password',
] as const) {}
// {
//   @IsString()
//   @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
//   password: string;
//
