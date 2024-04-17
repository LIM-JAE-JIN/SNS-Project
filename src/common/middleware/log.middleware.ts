import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  /**
   * 미들웨어 활용성
   *
   * - 실제 로그파일을 생성
   * - 로그를 모니터링하는 시스템 및 서비스
   * - 고 트래픽에 굉장히 고도화 되어 있어야하는 프로그램들을 모니터링할 때
   * - 보안적인 요소 (cors, 헬멧 등)
   */

  use(req: any, res: any, next: NextFunction) {
    console.log(
      `[REQ] ${req.method} ${req.url} ${new Date().toLocaleString('kr')}`,
    );

    next();
  }
}
