import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { DefaultFilterQuery } from 'src/prisma/filter/default.filter';

export default class AnnouncementQuery extends DefaultFilterQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPublished: true;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => String)
  @IsString()
  company: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => String)
  @IsString()
  division: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => String)
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiredAt: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  published: boolean;
}
