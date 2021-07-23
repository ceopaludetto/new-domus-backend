import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { State } from "@/models";

import { StateResolver } from "./state.resolver";
import { StateService } from "./state.service";

@Module({
  imports: [MikroOrmModule.forFeature([State])],
  providers: [StateService, StateResolver],
  exports: [StateService],
})
export class StateModule {}
