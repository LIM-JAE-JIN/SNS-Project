import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        // 해당 컬럼의 타입에 맞게 변환 (query값의 타입 알맞게 변환)
        enableImplicitConversion: true,
      },
      // 벨리데이터에 적용되지 않은 요청 값 삭제
      whitelist: true,
      // 적용되지 않은 요청 값 삭제 대신 에러 반환
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
