import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String, required: true })
  communityId: string;

  @Prop({ type: Number, default: 0 })
  sortOrder: number;

  @Prop({ type: Boolean, default: false })
  isPublished: boolean;

  @Prop({ type: String })
  coverImageUrl?: string;

  @Prop({ type: String })
  createdBy?: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.index({ communityId: 1, isPublished: 1, sortOrder: 1 });
