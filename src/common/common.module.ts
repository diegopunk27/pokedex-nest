import { Module } from '@nestjs/common';
import { HttpAxiosAdapter } from './adapters/http-axios-adapter';

@Module({
    providers:[HttpAxiosAdapter],
    exports:[HttpAxiosAdapter]
})
export class CommonModule {}
