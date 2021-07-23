import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Local } from "@/models";

import { LocalResolver } from "./local.resolver";
import { LocalService } from "./local.service";

@Module({
  imports: [MikroOrmModule.forFeature([Local])],
  providers: [LocalResolver, LocalService],
  exports: [LocalService],
})
export class LocalModule {}
