import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createTypeOrmOptions() {
        const options = this.configService.get('typeorm');
        if (!options) throw new InternalServerErrorException('TypeORM configuration not found');
        options.username ??= this.configService.get('DATABASE_USERNAME');
        options.password ??= this.configService.get('DATABASE_PASSWORD');
        options.database ??= this.configService.get('DATABASE_NAME');
        options.host ??= this.configService.get('DATABASE_HOST');

        return options;
    }
}
