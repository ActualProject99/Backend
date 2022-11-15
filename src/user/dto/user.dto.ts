import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../models/user.entity';

export class UserDTO extends OmitType(UserEntity, ['password'] as const) {}
