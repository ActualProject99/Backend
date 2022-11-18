import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { User } from '../../entities/user.entity';

export class UserLoginDTO extends PickType(User, [
  'email',
  'password',
] as const) {
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}
