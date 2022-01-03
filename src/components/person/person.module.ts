import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Person } from "@/models";

import { PersonResolver } from "./person.resolver";
import { PersonService } from "./person.service";

@Module({
  imports: [MikroOrmModule.forFeature([Person])],
  providers: [PersonResolver, PersonService],
  exports: [PersonService],
})
export class PersonModule {}
