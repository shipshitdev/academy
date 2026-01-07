import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  stripeCustomerId: string;

  @Prop({ type: String, required: true })
  stripeSubscriptionId: string;

  @Prop({ type: String, default: 'active' })
  status: string;

  @Prop({ type: Date })
  currentPeriodEnd?: Date;

  @Prop({ type: Boolean, default: false })
  cancelAtPeriodEnd?: boolean;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

SubscriptionSchema.index({ userId: 1 });
SubscriptionSchema.index({ stripeSubscriptionId: 1 }, { unique: true });
