import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { FullDateTimeString } from '../code/date';
import dayjs from 'dayjs';

@Injectable()
export class CustomLogService implements LoggerService {
    private readonly logger = new Logger();

    constructor(@Inject('SERVICE_NAME') private serviceName: string) {}

    log(message: any, ...params: any[]) {
        const log = `[info] ${dayjs().format(FullDateTimeString)} [${this.serviceName}] ${message}`;
        if (!params) return this.logger.log(log);

        for (const [key, value] of Object.entries(params)) {
            this.logger.log(`${log} - ${key}:${value}`);
        }
    }
    error(message: any, ...params: any[]) {
        const log = `[error] ${dayjs().format(FullDateTimeString)} [${this.serviceName}] ${JSON.stringify(message)}`;
        if (!params) return this.logger.error(log);

        for (const [key, value] of Object.entries(params)) {
            this.logger.error(`${log} - ${key}:${value}`);
        }
    }
    warn(message: any, ...params: any[]) {
        const log = `[warn] ${dayjs().format(FullDateTimeString)} [${this.serviceName}] ${JSON.stringify(message)}`;
        if (!params) return this.logger.warn(log);

        for (const [key, value] of Object.entries(params)) {
            this.logger.warn(`${log} - ${key}:${value}`);
        }
    }
}
