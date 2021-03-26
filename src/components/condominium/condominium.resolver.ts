import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";

import { Condominium } from "@/models";
import { ShowAll, FindByID } from "@/utils/common.dto";
import type { Mapped } from "@/utils/common.dto";
import { MapFields } from "@/utils/plugins";

import { GqlAuthGuard } from "../authentication/authentication.guard";
import { CurrentCondominium } from "./condominium.decorator";
import { GqlCondominiumGuard } from "./condominium.guard";
import { CondominiumService } from "./condominium.service";
import { CondominiumUpdateInput } from "./condonimium.dto";

@Resolver(() => Condominium)
export class CondominiumResolver {
  public constructor(private readonly condominiumService: CondominiumService) {}

  @Query(() => [Condominium])
  public async showCondominiums(
    @Args({ nullable: true }) { take, skip }: ShowAll,
    @MapFields() mapped?: Mapped<Condominium>
  ) {
    return this.condominiumService.showAll({ take, skip }, mapped);
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
