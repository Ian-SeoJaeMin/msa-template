import { NestFactory } from '@nestjs/core';
import { LoggerConfig } from '@app/common/logger/logger.config';
import { LoggerInterceptor } from '@app/common/logger/logger.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth.module';

async function bootstrap() {
    const app = await NestFactory.create(AuthModule, {
        bufferLogs: true,
        logger: new LoggerConfig('auth').create()
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
