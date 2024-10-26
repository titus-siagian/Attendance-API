import { Module } from '@nestjs/common';
import { MasterLocationsService } from './master-locations.service';
import { MasterLocationsController } from './master-locations.controller';

@Module({
  controllers: [MasterLocationsController],
  providers: [MasterLocationsService]
})
export class MasterLocationsModule {}
