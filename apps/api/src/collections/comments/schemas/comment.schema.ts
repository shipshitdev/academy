import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: String, required: true })
  lessonId: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  userName: string;

  @Prop({ type: String })
  userAvatar?: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String })
  parentId?: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.index({ lessonId: 1, createdAt: -1 });
CommentSchema.index({ parentId: 1 });
