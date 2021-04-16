import { Resolver, Query, Args } from "@nestjs/graphql";

import { Local } from "@/models";
import { FindByID } from "@/utils/common.dto";
import type { Mapped } from "@/utils/common.dto";
import { ConnectionArgs, fromArray, MapFields, ShowAllQuery } from "@/utils/plugins";

import { LocalService } from "./local.service";

@Resolver(() => Local)
export class LocalResolver {
  public constructor(private readonly localService: LocalService) {}

  @ShowAllQuery(() => Local)
  public async showLocals(@Args() args: ConnectionArgs, @MapFields({ paginated: true }) mapped?: Mapped<Local>) {
    const { offset, limit } = args.paginationParams();
    const [locals, count] = await this.localService.showAll({ offset, limit }, mapped);

    return fromArray(locals, args, count, offset);
  }

  @Query(() => Local)
  public findLocalByID(@Args() { id }: FindByID, @MapFields() mapped?: Mapped<Local>) {
    return this.localService.findByID(id, mapped);
  }
}
