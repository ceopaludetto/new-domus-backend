import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Condominium } from "@/models";

import { CondominiumResolver } from "./condominium.resolver";
import { CondominiumService } from "./condominium.service";

@Module({
  imports: [MikroOrmModule.forFeature([Condominium])],
  providers: [CondominiumResolver, CondominiumService],
  exports: [CondominiumService],
})
export class CondominiumModule {}
