import { Resolver, Args, Query } from "@nestjs/graphql";

import { State } from "@/models";
import { FindByID } from "@/utils/common.dto";
import type { Mapped, Sort } from "@/utils/common.dto";
import { ConnectionArgs, fromArray, MapFields, ShowAllQuery, SortFields } from "@/utils/plugins";

import { StateSortInput } from "./state.dto";
import { StateService } from "./state.service";

@Resolver(() => State)
export class StateResolver {
  public constructor(private readonly stateService: StateService) {}

  @ShowAllQuery(() => State)
  public async showStates(
    @Args() args: ConnectionArgs,
    @MapFields({ paginated: true }) mapped?: Mapped<State>,
    @SortFields(() => StateSortInput) sort?: Sort<State>
  ) {
    const { offset, limit } = args.paginationParams();
    const [states, count] = await this.stateService.showAll({ offset, limit, sort }, mapped);

    return fromArray(states, args, count, offset);
  }

  @Query(() => State)
  public async findStateByID(@Args() { id }: FindByID, @MapFields() mapped?: Mapped<State>) {
    return this.stateService.findByID(id, mapped);
  }
}
