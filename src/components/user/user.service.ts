import { InjectRepository } from "@mikro-orm/nestjs";
import type { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import { User } from "@/models";
import type { ConnectionArgumentsDatabaseParams } from "@/utils/plugins/graphql";

import type { AddUserInput } from "../authentication/authentication.dto";

@Injectable()
export class UserService {
  public constructor(@InjectRepository(User) private readonly userRepository: EntityRepository<User>) {}

  public async findAll({ offset, limit }: ConnectionArgumentsDatabaseParams) {
    return this.userRepository.findAndCount({}, { offset, limit });
  }

  public async findOne(id: string) {
    return this.userRepository.findOne({ id });
  }

  public async findByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  public async create(input: AddUserInput) {
    const user = this.userRepository.create(input);
    await this.userRepository.persistAndFlush(user);

    return user;
  }
}
