import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: Date, required: true })
  startsAt: Date;

  @Prop({ type: Date })
  endsAt?: Date;

  @Prop({ type: String, required: true })
  meetUrl: string;

  @Prop({ type: String })
  communityId?: string;

  @Prop({ type: Boolean, default: false })
  isPaidOnly: boolean;

  @Prop({ type: Boolean, default: false })
  isPublished: boolean;

  @Prop({ type: String })
  createdBy?: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.index({ startsAt: 1 });
EventSchema.index({ communityId: 1, startsAt: 1 });
