import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';

export class UserRegisterDTO extends PickType(User, [
  'email',
  // 'profileImg',
  'nickname',
  'password',
  'phoneNumber',
] as const) {
  // @ApiProperty()
  // email: string;
  // @ApiProperty()
  // nickname: string;
  // @ApiProperty()
  // password: string;
  // @ApiProperty()
  // phoneNumber: string;
}
