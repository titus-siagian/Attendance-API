import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { ApiFile } from 'src/announcement/decorators/api-file.decorator';
import { fileMimetypeFilter } from 'src/announcement/filters/file-mime-filters';
import { FilesEntity } from './entities/files.entity';

@Controller('files')
export class FilesController {
  @Get(':fileName')
  getFiles(@Param('fileName') fileName: string, @Res() res: Response) {
    return res.sendFile(fileName, { root: 'files' });
  }

  @ApiCreatedResponse({ type: FilesEntity })
  @ApiFile('file', true, {
    fileFilter: fileMimetypeFilter('image', 'application', 'text'),
  })
  @Post()
  addAttachment(@UploadedFile() file: Express.Multer.File) {
    return {
      data: new FilesEntity(file.originalname, file.path),
    };
  }
}
