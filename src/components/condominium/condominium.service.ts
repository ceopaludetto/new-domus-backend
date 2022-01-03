import { InjectRepository } from "@mikro-orm/nestjs";
import type { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import { Condominium } from "@/models";
import type { ConnectionArgumentsDatabaseParams } from "@/utils/plugins/graphql";
import type { Mapped } from "@/utils/types";

@Injectable()
export class CondominiumService {
  public constructor(
    @InjectRepository(Condominium) private readonly condominiumRepository: EntityRepository<Condominium>
  ) {}

  public async findAll({ offset, limit }: ConnectionArgumentsDatabaseParams, mapped?: Mapped<Condominium>) {
    return this.condominiumRepository.findAndCount({}, { offset, limit, populate: mapped });
  }

  public async findOne(id: string, mapped?: Mapped<Condominium>) {
    return this.condominiumRepository.findOneOrFail({ id }, mapped);
  }
}
