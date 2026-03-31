import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ unique: true, required: true })
  orderID: string;

  @Prop({
    required: true,
    enum: ['PENDING', 'PAID', 'COMPLETED', 'CANCELLED'],
    default: 'COMPLETED',
  })
  status: string;

  @Prop([
    {
      productName: { type: String, required: true },
      unitePrice: { type: Number, required: true },
      quantity: { type: Number, required: true },
      totalUnitPrice: { type: Number, required: true },
    },
  ])
  products: Array<{
    productName: string;
    unitePrice: number;
    quantity: number;
    totalUnitPrice: number;
  }>;

  @Prop({ type: Object, required: true })
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  @Prop({ required: true })
  totalPrice: number;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
