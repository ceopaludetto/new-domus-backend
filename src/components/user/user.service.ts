import { InjectRepository } from "@mikro-orm/nestjs";
import type { EntityRepository } from "@mikro-orm/postgresql";
import { BadRequestException, Injectable } from "@nestjs/common";

import { User } from "@/models";
import type { ConnectionArgumentsDatabaseParams } from "@/utils/plugins/graphql";
import type { Mapped } from "@/utils/types";

import type { AddUserInput } from "./user.dto";

@Injectable()
export class UserService {
  public constructor(@InjectRepository(User) private readonly userRepository: EntityRepository<User>) {}

  private async populate(user: User, mapped?: Mapped<User>) {
    if (!mapped) throw new BadRequestException("User must provide fields");
    return this.userRepository.populate(user, mapped);
  }

  public async findAll({ offset, limit }: ConnectionArgumentsDatabaseParams, mapped?: Mapped<User>) {
    return this.userRepository.findAndCount({}, { offset, limit, populate: mapped });
  }

  public async findOne(id: string, mapped?: Mapped<User>) {
    return this.userRepository.findOneOrFail({ id }, mapped);
  }

  public async findByEmail(email: string, mapped?: Mapped<User>) {
    return this.userRepository.findOne({ email }, mapped);
  }

  public async create(input: AddUserInput, mapped?: Mapped<User>) {
    const user = this.userRepository.create(input);
    await this.userRepository.persistAndFlush(user);

    return this.populate(user, mapped);
  }
}
