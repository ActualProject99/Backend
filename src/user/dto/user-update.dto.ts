import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Matches, MaxLength, MinLength } from 'class-validator';

export class UserUpdateDTO {
  @IsOptional()
  @ApiProperty({
    type: String,
    description: '프로필이미지',
    example: '사진.jpg',
  })
  profileImg?: string;

  @IsOptional()
  @MinLength(2, { message: '2자이상을 입력해주세요' })
  @MaxLength(6, { message: '6자 이하를 입력해주세요' })
  @ApiProperty({ type: String, description: '닉네임', example: '닉네임' })
  nickname?: string;

  @IsOptional()
  @MinLength(8, { message: '8자이상을 입력해주세요' })
  @MaxLength(20, { message: '20자 이하를 입력해주세요' })
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '비밀번호를 영어와 숫자로만 만들어주세요 ',
  })
  @ApiProperty({
    type: String,
    description: '비밀번호',
    example: '1q2w3e4r',
  })
  password?: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    description: '비밀번호 확인',
    example: '1q2w3e4r',
  })
  confirmPassword?: string;
}
