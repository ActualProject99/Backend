import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query((_) => String, { description: 'sms발송' })
  sendSMS(@Args('phoneNumber') phoneNumber: string): Promise<string> {
    return this.authService.sendSMS(phoneNumber);
  }

  @Query((_) => String, { description: 'sms발송' })
  checkSMS(
    @Args('phoneNumber') phoneNumber: string,
    @Args('inputNumber') inputNumber: string,
  ): Promise<boolean> {
    return this.authService.checkSMS(phoneNumber, inputNumber);
  }
}
