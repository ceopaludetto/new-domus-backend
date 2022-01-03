import { Args, Resolver, Query } from "@nestjs/graphql";
import { connectionFromArraySlice } from "graphql-relay";

import { User } from "@/models";
import { FindOne, ConnectionQuery, ConnectionArguments } from "@/utils/plugins/graphql";
import { MapFields } from "@/utils/plugins/map";
import type { Mapped } from "@/utils/types";

import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
  public constructor(private readonly userService: UserService) {}

  @ConnectionQuery(() => User)
  public async users(@Args() args: ConnectionArguments, @MapFields({ paginated: true }) mapped?: Mapped<User>) {
    const { limit, offset } = args.databaseParams();
    const [users, count] = await this.userService.findAll({ limit, offset }, mapped);

    return connectionFromArraySlice(users, args, { arrayLength: count, sliceStart: offset });
  }

  @Query(() => User)
  public async user(@Args() { id }: FindOne) {
    return this.userService.findOne(id);
  }
}
