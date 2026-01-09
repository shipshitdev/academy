import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

export type LessonDocument = Lesson & Document;

@Schema({ timestamps: true })
export class Lesson {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @Prop({ type: String })
  content?: string;

  @Prop({ type: String })
  videoId?: string;

  @Prop({ type: String, required: true })
  courseId: string;

  @Prop({ type: Number, default: 0 })
  sortOrder: number;

  @Prop({ type: Boolean, default: false })
  isPublished: boolean;

  @Prop({ type: Boolean, default: false })
  isPreview: boolean;

  @Prop({
    type: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
        description: { type: String },
      },
    ],
    default: [],
  })
  actions?: Array<{
    title: string;
    content: string;
    description?: string;
  }>;

  @Prop({
    type: [
      {
        title: { type: String, required: true },
        prompt: { type: String, required: true },
        description: { type: String },
      },
    ],
    default: [],
  })
  prompts?: Array<{
    title: string;
    prompt: string;
    description?: string;
  }>;

  @Prop({ type: String })
  createdBy?: string;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);

LessonSchema.index({ courseId: 1, isPublished: 1, sortOrder: 1 });
