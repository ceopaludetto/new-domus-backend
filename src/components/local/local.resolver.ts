import { Resolver, Query, Args } from "@nestjs/graphql";

import { Local } from "@/models";
import { ShowAll, FindByID } from "@/utils/common.dto";
import type { Mapped } from "@/utils/common.dto";
import { MapFields } from "@/utils/plugins";

import { LocalService } from "./local.service";

@Resolver(() => Local)
export class LocalResolver {
  public constructor(private readonly localService: LocalService) {}

  @Query(() => [Local])
  public showLocals(@Args({ nullable: true }) { take, skip }: ShowAll, @MapFields() mapped?: Mapped<Local>) {
    return this.localService.showAll({ take, skip }, mapped);
  }

  @Query(() => Local)
  public findLocalByID(@Args() { id }: FindByID, @MapFields() mapped?: Mapped<Local>) {
    return this.localService.findByID(id, mapped);
  }
}
