import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";

import { Condominium } from "@/models";
import { FindByID } from "@/utils/common.dto";
import type { Mapped } from "@/utils/common.dto";
import { ConnectionArgs, fromArray, MapFields, ShowAllQuery } from "@/utils/plugins";

import { GqlAuthGuard } from "../authentication/authentication.guard";
import { CurrentCondominium } from "./condominium.decorator";
import { GqlCondominiumGuard } from "./condominium.guard";
import { CondominiumService } from "./condominium.service";
import { CondominiumUpdateInput } from "./condonimium.dto";

@Resolver(() => Condominium)
export class CondominiumResolver {
  public constructor(private readonly condominiumService: CondominiumService) {}

  @ShowAllQuery(() => Condominium)
  public async showCondominiums(
    @Args() args: ConnectionArgs,
    @MapFields({ paginated: true }) mapped?: Mapped<Condominium>
  ) {
    const { offset, limit } = args.paginationParams();
    const [condominiums, count] = await this.condominiumService.showAll({ offset, limit }, mapped);

    return fromArray(condominiums, args, count, offset);
  }

  @Query(() => Condominium)
  public async findCondominiumByID(@Args() { id }: FindByID, @MapFields() mapped?: Mapped<Condominium>) {
    return this.condominiumService.findByID(id, mapped);
  }

  @UseGuards(GqlAuthGuard, GqlCondominiumGuard)
  @Query(() => Condominium)
  public async currentCondominium(
    @CurrentCondominium() condominium: string,
    @MapFields() mapped?: Mapped<Condominium>
  ) {
    return this.condominiumService.findByID(condominium, mapped);
  }

  @UseGuards(GqlAuthGuard, GqlCondominiumGuard)
  @Mutation(() => Condominium)
  public async updateCondominium(
    @CurrentCondominium() condominium: string,
    @Args("input") input: CondominiumUpdateInput,
    @MapFields() mapped?: Mapped<Condominium>
  ) {
    return this.condominiumService.update(condominium, input, mapped);
  }
}
