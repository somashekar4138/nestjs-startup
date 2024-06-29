import { Injectable } from '@nestjs/common';
import { RequestBodyOpenaiDto } from './dto/request-body-openai.dto';
import * as fs from 'fs';
import { PrismaService } from '@/prisma/prisma.service';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenaiService {
  private genAI: GoogleGenerativeAI;
  private genAiProModel: GenerativeModel;
  constructor(
    private prismaServe: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.genAI = new GoogleGenerativeAI(
      this.configService.get('GOOGLE_API_KEY'),
    );
    this.genAiProModel = this.genAI.getGenerativeModel({
      model: 'gemini-pro',
    });
  }
  async create(createOpenaiDto: RequestBodyOpenaiDto) {
    const schema = fs.readFileSync('./prisma/schema.prisma', 'utf8');
    const messages = `I have a Prisma.js Schema that you can read below: ${schema} and Write an SQL Query that will satisfy question: ${createOpenaiDto?.prompt} Respond only with an SQL Query that will satisfy the question. and table name should be in double quotes. and if question is related to BigInt or count then count result is cast to a text`;
    const result = await this.genAiProModel.generateContent(messages);
    const response = await result?.response;
    const text = response?.text();
    const querySplit = text.split('```sql')[1].split('```')[0];
    const singleLineQuery = querySplit.replace(/\s+/g, ' ').trim();
    console.log(singleLineQuery);
    const resulta = await this.prismaServe.$queryRawUnsafe(singleLineQuery);
    return resulta;
  }
}