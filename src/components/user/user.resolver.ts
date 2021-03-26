import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Args, Mutation, Context } from "@nestjs/graphql";

import { GqlAuthGuard } from "@/components/authentication/authentication.guard";
import { User } from "@/models";
import { FindByID, ShowAll, ContextType } from "@/utils/common.dto";
import type { Mapped, Sort } from "@/utils/common.dto";
import { MapFields, SortFields } from "@/utils/plugins";

import { FindUserByLogin, UserSortInput, UserUpdateInput } from "./user.dto";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
  public constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  public async showUsers(
    @Args({ nullable: true }) { skip, take }: ShowAll,
    @SortFields(() => UserSortInput) sort?: Sort<User>,
    @MapFields() mapped?: Mapped<User>
  ) {
    return this.userService.showAll({ skip, sort, take }, mapped);
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
