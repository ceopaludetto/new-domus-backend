import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module, OnModuleInit } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

import { User } from "@/models";

import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule implements OnModuleInit {
  public constructor(@InjectPinoLogger(UserModule.name) private readonly logger: PinoLogger) {}

  public onModuleInit() {
    this.logger.info("UserModule successfully started");
  }
}
