import { MailerService } from "@nestjs-modules/mailer";
import { Processor, Process, OnQueueActive } from "@nestjs/bull";
import type { Job } from "bull";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

import type { User } from "@/models";

@Processor("mail")
export class MailQueueConsumer {
  public constructor(
    @InjectPinoLogger(MailQueueConsumer.name) private readonly logger: PinoLogger,
    private readonly mailer: MailerService
  ) {}

  @OnQueueActive()
  public onActive(job: Job<any>) {
    this.logger.debug(`Sending an mail of type ${job.name}`, { id: job.id, data: job.data });
  }

  @Process("register")
  public async sendRegisterMail(job: Job<User>) {
    try {
      const info = await this.mailer.sendMail({
        to: job.data.person.email,
        from: '"Carlos Eduardo" <ceo.paludetto@gmail.com>',
        subject: "[NestNewGraphql] Welcome",
        template: "cadastro",
        context: {
          name: job.data.person.name,
        },
      });

      return info;
    } catch (error) {
      this.logger.error("Falha ao enviar e-mail de registro", error);
      throw error;
    }
  }

  @Process("forgot")
  public async sendForgotMail(job: Job<{ user: User; callback: string }>) {
    try {
      const info = await this.mailer.sendMail({
        to: job.data.user.person.email,
        from: '"Carlos Eduardo" <ceo.paludetto@gmail.com>',
        subject: "[NestNewGraphql] Forgot",
        template: "forgot",
        context: {
          name: job.data.user.person.name,
          callback: job.data.callback,
        },
      });

      return info;
    } catch (error) {
      this.logger.error("Falha ao enviar e-mail de esqueci senha", error);
      throw error;
    }
  }
}
