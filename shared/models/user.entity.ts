import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Company } from './company.entity';
import { Product } from './product.entity';
import { HSNCode } from './hSNCode.entity';
import { Tax } from './tax.entity';
import { ProductUnit } from './productUnit.entity';

export class User {
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
  email: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  name: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  phone: string | null;
  @ApiProperty({
    type: 'string',
  })
  password: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  resetToken: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  resetTokenExpiry: Date | null;
  @ApiHideProperty()
  company?: Company[];
  @ApiHideProperty()
  product?: Product[];
  @ApiHideProperty()
  hsnCode?: HSNCode[];
  @ApiHideProperty()
  tax?: Tax[];
  @ApiHideProperty()
  productUnit?: ProductUnit[];
}
