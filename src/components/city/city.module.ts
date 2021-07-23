import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { City } from "@/models";

import { CityResolver } from "./city.resolver";
import { CityService } from "./city.service";

@Module({
  imports: [MikroOrmModule.forFeature([City])],
  providers: [CityService, CityResolver],
  exports: [CityService],
})
export class CityModule {}
