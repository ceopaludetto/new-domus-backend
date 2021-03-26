import { Resolver, Args, Query } from "@nestjs/graphql";

import { State } from "@/models";
import { FindByID, ShowAll } from "@/utils/common.dto";
import type { Mapped, Sort } from "@/utils/common.dto";
import { MapFields, SortFields } from "@/utils/plugins";

import { StateSortInput } from "./state.dto";
import { StateService } from "./state.service";

@Resolver(() => State)
export class StateResolver {
  public constructor(private readonly stateService: StateService) {}

  @Query(() => [State])
  public async showStates(
    @Args({ nullable: true }) { skip, take }: ShowAll,
    @MapFields() mapped?: Mapped<State>,
    @SortFields(() => StateSortInput) sort?: Sort<State>
  ) {
    return this.stateService.showAll({ skip, take, sort }, mapped);
  }

  @Query(() => State)
  public async findStateByID(@Args() { id }: FindByID, @MapFields() mapped?: Mapped<State>) {
    return this.stateService.findByID(id, mapped);
  }
}
