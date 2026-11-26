import { Module } from '@nestjs/common';
import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';
import { MyBusinessesController } from './my-businesses.controller';

@Module({
  controllers: [BusinessesController, MyBusinessesController],
  providers: [BusinessesService],
})
export class BusinessesModule {}
