import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    /**
     * 요청이 들어올 때 REQ 요청이 들어온 타입스탬프를 찍는다,
     * [REQ] {요청 path} {요청 시간}
     *
     * 요청이 끝날때 (응답이 나갈때) 다시 타임스탬프를 찍는다.
     * [RES] {요청 path} {응답 시간} {얼마나 걸렸는지 ms}
     */
    const now = new Date();

    const req = context.switchToHttp().getRequest();

    // /posts
    // common/image
    const path = req.originalUrl;

    console.log(`[REQ] ${path} ${now.toLocaleString('kr')}`);

    // return next.hamdle()을 실행하는 순간
    // 라우트의 로직이 전부 실행되고 응답이 반환된다.
    // observable로
    return next.handle().pipe(
      // [RES] {요청 path} {응답 시간} {얼마나 걸렸는지 ms}
      tap((observable) =>
        console.log(
          `[RES] ${path} ${new Date().toLocaleString('kr')} ${new Date().getMilliseconds() - now.getMilliseconds()}`,
        ),
      ),
      // map((observable) => {
      //   return {
      //     message: '응답이 변경 됐습니다.',
      //     response: observable,
      //   };
      // }),
    );
  }
}
