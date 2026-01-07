import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

export type MembershipDocument = Membership & Document;

@Schema({ timestamps: true })
export class Membership {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  communityId: string;

  @Prop({ type: String, default: 'active' })
  status: string;

  @Prop({ type: String, default: 'free' })
  source: string;

  @Prop({ type: Date, default: () => new Date() })
  joinedAt: Date;

  @Prop({ type: Date })
  canceledAt?: Date;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);

MembershipSchema.index({ userId: 1, communityId: 1 }, { unique: true });
MembershipSchema.index({ userId: 1, status: 1 });
