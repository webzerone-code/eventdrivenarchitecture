import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType, PartialType } from '@nestjs/mapped-types';
class CustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 15)
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

class ProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  @Min(0.01)
  unitePrice: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0.01)
  totalUnitPrice: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  orderID: string;

  @IsEnum(['PENDING', 'PAID', 'COMPLETED', 'CANCELLED'])
  @IsOptional()
  status: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];

  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @IsNumber()
  @Min(0.01)
  totalPrice: number;
}

export class UpdateOrderDto extends PartialType(
  OmitType(CreateOrderDto, ['orderID'] as const),
) {
  @IsEnum(['PENDING', 'PAID', 'COMPLETED', 'CANCELLED'])
  @IsOptional()
  status?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products?: ProductDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerDto)
  customer?: CustomerDto;
}
