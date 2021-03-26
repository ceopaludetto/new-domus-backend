import { Resolver, Query, Args } from "@nestjs/graphql";

import { Person } from "@/models";
import { FindByID, ShowAll } from "@/utils/common.dto";
import type { Mapped } from "@/utils/common.dto";
import { MapFields } from "@/utils/plugins";

import { PersonService } from "./person.service";

@Resolver(() => Person)
export class PersonResolver {
  public constructor(private readonly personService: PersonService) {}

  @Query(() => [Person])
  public async showPeople(@Args({ nullable: true }) { skip, take }: ShowAll, @MapFields() mapped?: Mapped<Person>) {
    return this.personService.showAll({ skip, take }, mapped);
  }

  @Query(() => Person)
  public async findPersonByID(@Args() { id }: FindByID, @MapFields() mapped?: Mapped<Person>) {
    return this.personService.findByID(id, mapped);
  }
}
