import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

export type CommunityDocument = Community & Document;

@Schema({ timestamps: true })
export class Community {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: Boolean, default: false })
  isFree: boolean;

  @Prop({ type: Number })
  priceMonthly?: number;

  @Prop({ type: Boolean, default: false })
  isPublished: boolean;

  @Prop({ type: Boolean, default: false })
  isFeatured: boolean;

  @Prop({ type: Number, default: 0 })
  sortOrder: number;

  @Prop({ type: String })
  coverImageUrl?: string;

  @Prop({ type: String })
  createdBy?: string;
}

export const CommunitySchema = SchemaFactory.createForClass(Community);

CommunitySchema.index({ isPublished: 1, sortOrder: 1 });
