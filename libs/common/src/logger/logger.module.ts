import { DynamicModule, Module } from '@nestjs/common';
import { CustomLogService } from './logger.service';

@Module({})
export class CustomLogModule {
    static register(serviceName: string): DynamicModule {
        return {
            module: CustomLogModule,
            providers: [
                {
                    provide: 'SERVICE_NAME',
                    useValue: serviceName
                },
                CustomLogService
            ],
            exports: [CustomLogService]
        };
    }
}
