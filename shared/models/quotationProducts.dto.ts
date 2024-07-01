import { ApiProperty } from '@nestjs/swagger';

export class QuotationProductsDto {
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  updatedAt: Date | null;
  @ApiProperty({
    type: 'boolean',
  })
  isExist: boolean;
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  quotation_id: string;
  @ApiProperty({
    type: 'string',
  })
  product_id: string;
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  quantity: number;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  tax_id: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  hsnCode_id: string | null;
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  price: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  total: number;
}
