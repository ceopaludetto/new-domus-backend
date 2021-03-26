import { UseGuards } from "@nestjs/common";
import { Resolver, Args, Query, Mutation } from "@nestjs/graphql";

import { GqlAuthGuard } from "@/components/authentication/authentication.guard";
import { GqlCondominiumGuard, CurrentCondominium } from "@/components/condominium";
import { Block } from "@/models";
import { FindByID, ShowAll } from "@/utils/common.dto";
import type { Mapped } from "@/utils/common.dto";
import { MapFields } from "@/utils/plugins";

import { BlockInsertInput, BlockUpdateInput } from "./block.dto";
import { BlockService } from "./block.service";

@Resolver(() => Block)
export class BlockResolver {
  public constructor(private readonly blockService: BlockService) {}

  @UseGuards(GqlAuthGuard, GqlCondominiumGuard)
  @Query(() => [Block])
  public async showBlocks(
    @Args({ nullable: true }) { take, skip }: ShowAll,
    @CurrentCondominium() condominium: string,
    @MapFields() mapped?: Mapped<Block>
  ) {
    return this.blockService.showAll(condominium, { take, skip }, mapped);
  }

  @Query(() => Block)
  public async findBlockByID(@Args() { id }: FindByID, @MapFields() mapped?: Mapped<Block>) {
    return this.blockService.findByID(id, mapped);
  }

  @UseGuards(GqlAuthGuard, GqlCondominiumGuard)
  @Mutation(() => Block)
  public async createBlock(
    @Args("input") data: BlockInsertInput,
    @CurrentCondominium() condominium: string,
    @MapFields() mapped?: Mapped<Block>
  ) {
    return this.blockService.create({ ...data, condominium }, mapped);
  }

  @UseGuards(GqlAuthGuard, GqlCondominiumGuard)
  @Mutation(() => Block)
  public async updateBlock(
    @Args("input") data: BlockUpdateInput,
    @Args() { id }: FindByID,
    @MapFields() mapped?: Mapped<Block>
  ) {
    return this.blockService.update(id, data, mapped);
  }

  @UseGuards(GqlAuthGuard, GqlCondominiumGuard)
  @Mutation(() => Block)
  public async deleteBlock(@Args() { id }: FindByID, @MapFields() mapped?: Mapped<Block>) {
    return this.blockService.delete(id, mapped);
  }
}
