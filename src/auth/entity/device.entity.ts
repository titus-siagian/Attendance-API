import { ApiProperty } from '@nestjs/swagger';

export class DeviceIdEntity {
  @ApiProperty()
  deviceId: string;
}
