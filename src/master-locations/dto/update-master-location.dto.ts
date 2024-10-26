import { PartialType } from '@nestjs/swagger';
import { CreateMasterLocationDto } from './create-master-location.dto';

export class UpdateMasterLocationDto extends PartialType(
  CreateMasterLocationDto,
) {}
