import { OmitType } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';

export class UserDTO extends OmitType(User, ['password'] as const) {}
