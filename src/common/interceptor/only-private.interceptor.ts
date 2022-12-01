import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class OnlyPrivateInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(request.headers, user);
    if (user) return next.handle().pipe(map((data) => data));
    else throw new UnauthorizedException('인증에 문제가 있습니다.');
  }
}

// 왜 콘솔로그가 안뜰까요?
// 브라우저 토큰이라는데 쿠키에 저장되는거라 http를 가져오게되면 무조건 사용하게 되는데
// 사실 잘 뜨고있긴합니다...?
// 흠 connect.sid는 건드릴수 없는부분이라 어찌할수가 없네여...

// @Injectable()
// export class OnlyPrivateInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<> {
//     const request: Request = context.switchToHttp().getRequest();
//     const { authorization, refreshToken } = request.headers;
//     console.log(authorization);
//     if (authorization) return next.handle().pipe(map((data) => data));
//     else throw new UnauthorizedException('인증에 문제가 있습니다.');
//   }
// }

// @Injectable()
// export class OnlyPrivateInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<> {
//     const request: Request = context.switchToHttp().getRequest();
//     const { authorization, refreshToken } = request.headers;
//     console.log(authorization);
//     if (authorization) return next.handle().pipe(map((data) => data));
//     else throw new UnauthorizedException('인증에 문제가 있습니다.');
//   }
// }
