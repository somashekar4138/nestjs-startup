import { ProductType } from '@prisma/client';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Currencies } from './currencies.entity';
import { ProductUnit } from './productUnit.entity';
import { HSNCode } from './hSNCode.entity';
import { Tax } from './tax.entity';
import { User } from './user.entity';
import { InvoiceProducts } from './invoiceProducts.entity';

export class Product {
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
  name: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  description: string | null;
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  price: number;
  @ApiProperty({
    enum: ProductType,
  })
  type: ProductType;
  @ApiProperty({
    type: 'string',
  })
  currency_id: string;
  @ApiProperty({
    type: () => Currencies,
    required: false,
  })
  currency?: Currencies;
  @ApiProperty({
    type: 'string',
  })
  unit_id: string;
  @ApiProperty({
    type: () => ProductUnit,
    required: false,
  })
  unit?: ProductUnit;
  @ApiProperty({
    type: 'string',
  })
  hsnCode_id: string;
  @ApiProperty({
    type: () => HSNCode,
    required: false,
  })
  hsnCode?: HSNCode;
  @ApiProperty({
    type: 'string',
  })
  tax_id: string;
  @ApiProperty({
    type: () => Tax,
    required: false,
  })
  tax?: Tax;
  @ApiProperty({
    type: 'string',
  })
  user_id: string;
  @ApiProperty({
    type: () => User,
    required: false,
  })
  user?: User;
  @ApiHideProperty()
  invoice?: InvoiceProducts[];
}
