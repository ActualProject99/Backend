import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';

export class UserPhoneVerifyDTO extends PickType(User, [] as const) {
  @ApiProperty({
    type: Number,
    description: '핸드폰번호 인증',
    example: '사진.01022223333',
  })
  phoneNumber: number;

  @ApiProperty({
    type: Number,
    description: '핸드폰 인증번호',
    example: '0000',
  })
  confirmNum: number;
}
