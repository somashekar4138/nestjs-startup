import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UploadResponseDto } from './dto/upload-response.dto';
import { ApiSuccessResponse } from '@shared/decorators/api-success-response.decorator';
import { SuccessResponseDto } from '@shared/dto/success-response.dto';
import { IsPublic } from '@shared/decorators/public.decorator';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @IsPublic()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiSuccessResponse(UploadResponseDto, { status: 201 })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SuccessResponseDto<UploadResponseDto>> {
    const link = await this.uploadService.upload(file);
    return {
      result: link,
      message: 'File uploaded successfully',
    };
  }
}
