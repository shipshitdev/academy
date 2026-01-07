import { type MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import type { Response } from 'express';
import { json } from 'express';
import {
  Subscription,
  SubscriptionSchema,
} from '../collections/subscriptions/schemas/subscription.schema';
import { SubscriptionsService } from '../collections/subscriptions/subscriptions.service';
import type { IRawBodyRequest } from '../types/requests';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { StripeWebhookController } from './stripe-webhook.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Subscription.name, schema: SubscriptionSchema }])],
  controllers: [BillingController, StripeWebhookController],
  providers: [BillingService, SubscriptionsService],
  exports: [BillingService],
})
export class BillingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        json({
          verify: (req: IRawBodyRequest, _res: Response, buf: Buffer) => {
            req.rawBody = buf;
          },
        }),
      )
      .forRoutes('webhooks/stripe');
  }
}
