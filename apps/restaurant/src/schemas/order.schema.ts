import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

export type OrderStatus = 'ACTIVE' | 'DRAFT';

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, enum: ['ACTIVE', 'DRAFT'], default: 'DRAFT' })
  status: OrderStatus;

  @Prop({ required: false })
  imageUrl?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
