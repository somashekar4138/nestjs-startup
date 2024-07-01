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
      generationConfig: {
        temperature: 0.4,
        topP: 1,
        topK: 32,
        maxOutputTokens: 4096,
      },
    });
  }

  async create(createOpenaiDto: RequestBodyOpenaiDto, user_id: string) {
    const schema = fs.readFileSync('./prisma/schema.prisma', 'utf8');
    const messages = `I have a Prisma.js Schema that you can read below: ${schema} and Write an SQL Query that will satisfy question: ${createOpenaiDto?.prompt} Respond only with an SQL Query that will satisfy the question. and table name should be in double quotes and table name should be same like in schema(make sure with capital letters). and if question is related to BigInt or Count then count result is cast to a text(like: CAST(count(*) AS TEXT)). The query should be specific to the user with ID: ${user_id}. even question is related to other user's data but query should be specific to the user with ID: ${user_id}`;
    const result = await this.genAiProModel.generateContent(messages);
    const response = await result?.response;
    await this.prismaServe.openAiHistory.create({
      data: {
        query: createOpenaiDto?.prompt,
        result: response?.text(),
        user_id,
      },
    });
    const text = response?.text();
    const querySplit = text.split('```sql')[1].split('```')[0];
    const singleLineQuery = querySplit.replace(/\s+/g, ' ').trim();
    console.log(singleLineQuery);
    const resulta = await this.prismaServe.$queryRawUnsafe(singleLineQuery);
    return resulta;
  }

  async createGraph(createOpenaiDto: RequestBodyOpenaiDto, user_id: string) {
    const schema = fs.readFileSync('./prisma/schema.prisma', 'utf8');
    const graphSample = {
      series: [
        {
          name: 'Inflation',
          data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2],
        },
      ],
      options: {
        chart: {
          height: 350,
          type: 'bar',
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: 'top', // top, center, bottom
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + '%';
          },
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ['#304758'],
          },
        },

        xaxis: {
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
          position: 'top',
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          crosshairs: {
            fill: {
              type: 'gradient',
              gradient: {
                colorFrom: '#D8E3F0',
                colorTo: '#BED1E6',
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              },
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            formatter: function (val) {
              return val + '%';
            },
          },
        },
        title: {
          text: 'Monthly Inflation in Argentina, 2002',
          floating: true,
          offsetY: 330,
          align: 'center',
          style: {
            color: '#444',
          },
        },
      },
    };
    const messages = `I have a Prisma.js Schema that you can read below: ${schema} and Write an SQL Query that will satisfy question: ${createOpenaiDto?.prompt} Respond only with an SQL Query for PostgreSQL that will satisfy the question. and make sure SQL Query need to be satisfy for PostgreSQL and table name should be in double quotes and table name should be same like in schema(make sure with capital letters). and if question is related to BigInt or Count then count result is cast to a text(like: CAST(count(*) AS TEXT)). The query should be specific to the user with ID: ${user_id}. even question is related to other user's data but query should be specific to the user with ID: ${user_id}`;
    const result = await this.genAiProModel.generateContent(messages);
    const response = await result?.response;
    const text = response?.text();
    await this.prismaServe.openAiHistory.create({
      data: {
        query: createOpenaiDto?.prompt,
        result: text ?? '',
        user_id,
      },
    });
    const querySplit = text.split('```sql')[1].split('```')[0];
    const singleLineQuery = querySplit.replace(/\s+/g, ' ').trim();
    console.log(singleLineQuery);
    const resulta = await this.prismaServe.$queryRawUnsafe(singleLineQuery);
    const graphGenPrompt = `i want to generate a graph json data format should be same like : ${JSON.stringify(graphSample)} and the data should be generated from the following data: ${JSON.stringify(resulta)} and respond only with a JSON data format for the graph.`;
    const graphResult =
      await this.genAiProModel.generateContent(graphGenPrompt);
    const graphResponse = await graphResult?.response;
    const graphText = graphResponse?.text();
    const graphData = JSON.parse(graphText);
    return graphData;
  }
}
