import { BullModule } from "@nestjs/bull";
import { Module, Global } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { MailQueueConsumer } from "./mail.queue.consumer";

@Global()
@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: "mail",
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>("QUEUE_HOST"),
          port: configService.get<number>("QUEUE_PORT"),
          password: configService.get<string>("QUEUE_PASSWORD"),
        },
      }),
    }),
  ],
  providers: [MailQueueConsumer],
  exports: [BullModule],
})
export class QueueModule {}
