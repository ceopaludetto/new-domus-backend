import { Resolver, Query, Args } from "@nestjs/graphql";

import { Person } from "@/models";
import { FindByID } from "@/utils/common.dto";
import type { Mapped } from "@/utils/common.dto";
import { ConnectionArgs, fromArray, MapFields, ShowAllQuery } from "@/utils/plugins";

import { PersonService } from "./person.service";

@Resolver(() => Person)
export class PersonResolver {
  public constructor(private readonly personService: PersonService) {}

  @ShowAllQuery(() => Person)
  public async showPeople(@Args() args: ConnectionArgs, @MapFields({ paginated: true }) mapped?: Mapped<Person>) {
    const { offset, limit } = args.paginationParams();
    const [people, count] = await this.personService.showAll({ offset, limit }, mapped);

    return fromArray(people, args, count, offset);
  }

  @Query(() => Person)
  public async findPersonByID(@Args() { id }: FindByID, @MapFields() mapped?: Mapped<Person>) {
    return this.personService.findByID(id, mapped);
  }
}
