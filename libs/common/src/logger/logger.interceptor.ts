import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { LoggerModel } from './models/logger.model';
import { catchError, tap } from 'rxjs';
import { CustomLogService } from './logger.service';

export class LoggerInterceptor implements NestInterceptor {
    private readonly logger = new CustomLogService(LoggerInterceptor.name);
    intercept(context: ExecutionContext, next: CallHandler) {
        const request: Request = context.switchToHttp().getRequest();
        const response: Response = context.switchToHttp().getResponse();
        const requestId = uuidv4();

        console.log(`[${requestId}] ${JSON.stringify(this.setLogInfo(request))} - Request received`);

        const now = Date.now();
        return next.handle().pipe(
            catchError((error: Error) => {
                this.catchError(requestId, response, now, error);
                throw error;
            }),
            tap(() => {
                const responseTime = Date.now() - now;
                if (responseTime >= 5000) console.log(`[${requestId}] Request took too long ${responseTime}ms`);
                if (process.env.NODE_ENV !== 'production') {
                    console.log(`[${requestId}] ${JSON.stringify(this.setLogInfo(request))} - Response sent in ${responseTime}ms`);
                }
            })
        );
    }

    private setLogInfo(request: Request): LoggerModel {
        const { method, originalUrl: url, params, query } = request;
        const body = Object.assign({}, request.body);
        delete body.password;

        return new LoggerModel({
            ip: String(request.headers['x-forwarded-for']).split('.')[0],
            method,
            url,
            body: JSON.stringify(request.body),
            query: JSON.stringify(query),
            params: JSON.stringify(params),
            userAgent: request.headers['user-agent'] || ''
        });
    }

    private catchError(requestId: string, response: Response, requestDtm: number, error: any) {
        response.on('finish', () => {
            const responseTime = Date.now() - requestDtm;
            if (responseTime >= 5000) console.log(`[${requestId}] Request took too long ${responseTime}ms`);

            console[this.errorLogType(response.statusCode)](`[${requestId}] ${error.message} - Response sent in ${responseTime}ms`);
        });
    }

    private errorLogType(statusCode: number): 'error' | 'warn' | 'info' {
        return statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    }
}
