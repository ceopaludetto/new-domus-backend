import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module, OnModuleInit } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

import { Person } from "@/models";

import { PersonResolver } from "./person.resolver";
import { PersonService } from "./person.service";

@Module({
  imports: [MikroOrmModule.forFeature([Person])],
  providers: [PersonService, PersonResolver],
  exports: [PersonService],
})
export class PersonModule implements OnModuleInit {
  public constructor(@InjectPinoLogger(PersonModule.name) private readonly logger: PinoLogger) {}

  public onModuleInit() {
    this.logger.info("PersonModule successfully started");
  }
}
