import { ApiProperty } from '@nestjs/swagger';

export class FilesEntity {
  constructor(name: string, path: string) {
    this.name = name;
    this.path = path;
  }

  @ApiProperty()
  name: string;

  @ApiProperty()
  path: string;
}
