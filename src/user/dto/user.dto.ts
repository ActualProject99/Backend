import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../../enties/user.entity';

export class UserDTO extends OmitType(UserEntity, ['password'] as const) {}
