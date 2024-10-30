import { LoggerService } from '@nestjs/common';
import { utilities, WinstonModule } from 'nest-winston';
import * as Winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, colorize, timestamp, printf, simple } = Winston.format;

export class LoggerConfig {
    serviceName: string;
    options: Winston.LoggerOptions;
    consoleOptions: Winston.transports.ConsoleTransportOptions;
    transports: Winston.transport[];
    debugMode: boolean;

    constructor(serviceName: string) {
        this.serviceName = serviceName;
        this.debugMode = process.env.NODE_ENV !== 'production';
    }

    level() {
        return this.debugMode ? 'debug' : 'info';
    }

    format() {
        return combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            utilities.format.nestLike(this.serviceName, { prettyPrint: true }),
            printf(({ level, message, timestamp }) => {
                return `${timestamp} [${this.serviceName}] ${level}: ${message}`;
            })
        );
    }

    create(): LoggerService {
        this.consoleOptions = {
            handleExceptions: true,
            level: this.debugMode ? 'debug' : 'info',
            format: this.debugMode ? combine(colorize(), this.format()) : simple()
        };

        this.transports = [
            new Winston.transports.Console(this.consoleOptions),
            new Winston.transports.DailyRotateFile({
                dirname: __dirname + '/../../logs',
                filename: `${this.serviceName}`,
                datePattern: '[log]',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d'
            })
        ];

        return WinstonModule.createLogger({
            level: this.level(),
            levels: Winston.config.syslog.levels,
            format: this.format(),
            transports: this.transports
        });
    }
}
