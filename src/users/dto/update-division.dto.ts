import { PartialType } from '@nestjs/swagger';
import { CreateDivisonDto } from './create-division.dto';

export class UpdateDivisionDto extends PartialType(CreateDivisonDto) {}
