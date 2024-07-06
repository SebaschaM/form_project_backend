import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogLevel } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];
  app.useLogger(logLevels);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
