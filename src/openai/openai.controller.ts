import { Controller, Post, Body } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { RequestBodyOpenaiDto } from './dto/request-body-openai.dto';
import { IsPublic } from '@shared/decorators/public.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser, User } from '@shared/decorators/user.decorator';

@ApiTags('openai')
@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @IsPublic()
  @Post()
  // ApiResponse Any
  @ApiResponse({
    status: 200,
    description: 'Create a new openai',
    schema: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
  })
  async create(
    @Body() createOpenaiDto: RequestBodyOpenaiDto,
    @GetUser() user: User,
  ) {
    return await this.openaiService.create(createOpenaiDto, user?.sub);
  }
}
