import { plainToClass } from 'class-transformer';

export class LoggerModel {
    ip: string;
    method: string;
    url: string;
    body: string;
    query: string;
    params: string;
    userAgent: string;

    constructor(log: LoggerModel) {
        return plainToClass(LoggerModel, log);
    }
}
