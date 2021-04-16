import { UseGuards } from "@nestjs/common";
import { Resolver, Args, Query, Mutation } from "@nestjs/graphql";

import { GqlAuthGuard } from "@/components/authentication/authentication.guard";
import { GqlCondominiumGuard, CurrentCondominium } from "@/components/condominium";
import { Block } from "@/models";
import { FindByID } from "@/utils/common.dto";
import type { Mapped } from "@/utils/common.dto";
import { MapFields, ShowAllQuery } from "@/utils/plugins";
import { ConnectionArgs, fromArray } from "@/utils/plugins/pagination.parameters";

import { ImageService } from "../image";
import { BlockInsertInput, BlockUpdateInput } from "./block.dto";
import { BlockService } from "./block.service";

@Resolver(() => Block)
export class BlockResolver {
  public constructor(private readonly blockService: BlockService, private readonly imageService: ImageService) {}

  @UseGuards(GqlAuthGuard, GqlCondominiumGuard)
  @ShowAllQuery(() => Block)
  public async showBlocks(
    @Args() args: ConnectionArgs,
    @CurrentCondominium() condominium: string,
    @MapFields({ paginated: true }) mapped?: Mapped<Block>
  ) {
    const { offset, limit } = args.paginationParams();
    const [blocks, count] = await this.blockService.showAll(condominium, { offset, limit }, mapped);

    return fromArray(blocks, args, count, offset);
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
