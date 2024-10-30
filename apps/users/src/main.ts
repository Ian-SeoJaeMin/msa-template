import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { LoggerConfig } from '@app/common/logger/logger.config';
import { LoggerInterceptor } from '@app/common/logger/logger.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(UsersModule, {
        bufferLogs: true,
        logger: new LoggerConfig('users').create()
    });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true
        })
    );
    app.useGlobalInterceptors(new LoggerInterceptor());
    await app.listen(process.env.port ?? 3000);
}
bootstrap();
