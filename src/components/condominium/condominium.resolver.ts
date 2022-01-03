import { Args, Resolver, Query } from "@nestjs/graphql";
import { connectionFromArraySlice } from "graphql-relay";

import { Condominium } from "@/models";
import { ConnectionArguments, ConnectionQuery, FindOne } from "@/utils/plugins/graphql";
import { MapFields } from "@/utils/plugins/map";
import type { Mapped } from "@/utils/types";

import { CondominiumService } from "./condominium.service";

@Resolver(() => Condominium)
export class CondominiumResolver {
  public constructor(private readonly condominiumService: CondominiumService) {}

  @ConnectionQuery(() => Condominium)
  public async condominiums(
    @Args() args: ConnectionArguments,
    @MapFields({ paginated: true }) mapped?: Mapped<Condominium>
  ) {
    const { limit, offset } = args.databaseParams();
    const [users, count] = await this.condominiumService.findAll({ limit, offset }, mapped);

    return connectionFromArraySlice(users, args, { arrayLength: count, sliceStart: offset });
  }

  @Query(() => Condominium)
  public async condominium(@Args() { id }: FindOne, @MapFields() mapped?: Mapped<Condominium>) {
    return this.condominiumService.findOne(id, mapped);
  }
}
