import { Module } from '@nestjs/common';
import { LawnMowerModule } from './lawn_mower/lawn-mower.module';

@Module({
  imports: [LawnMowerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
