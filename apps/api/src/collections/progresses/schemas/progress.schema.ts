import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

export type ProgressDocument = Progress & Document;

@Schema({ timestamps: true })
export class Progress {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  lessonId: string;

  @Prop({ type: Date })
  completedAt?: Date;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);

ProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
