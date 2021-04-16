import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Args, Mutation, Context } from "@nestjs/graphql";

import { GqlAuthGuard } from "@/components/authentication/authentication.guard";
import { User } from "@/models";
import { FindByID, ContextType } from "@/utils/common.dto";
import type { Mapped, Sort } from "@/utils/common.dto";
import { ConnectionArgs, fromArray, MapFields, ShowAllQuery, SortFields } from "@/utils/plugins";

import { FindUserByLogin, UserSortInput, UserUpdateInput } from "./user.dto";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
  public constructor(private readonly userService: UserService) {}

  @ShowAllQuery(() => User)
  public async showUsers(
    @Args() args: ConnectionArgs,
    @SortFields(() => UserSortInput) sort?: Sort<User>,
    @MapFields({ paginated: true }) mapped?: Mapped<User>
  ) {
    const { offset, limit } = args.paginationParams();
    const [users, count] = await this.userService.showAll({ offset, limit, sort }, mapped);

    return fromArray(users, args, count, offset);
  }

  @Query(() => User)
  public async findUserByID(@Args() { id }: FindByID, @MapFields() mapped?: Mapped<User>) {
    return this.userService.findByID(id, mapped);
  }

  @Query(() => User)
  public async findUserByLogin(@Args() { login }: FindUserByLogin, @MapFields() mapped?: Mapped<User>) {
    return this.userService.findByLogin(login, mapped);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  public async updateUser(
    @Context() ctx: ContextType,
    @Args("input") data: UserUpdateInput,
    @MapFields() mapped?: Mapped<User>
  ) {
    return this.userService.update(ctx.req.user, data, mapped);
  }
}
