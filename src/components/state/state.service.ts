import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";

import { State } from "@/models";
import type { Mapped, ShowAllWithSort } from "@/utils/common.dto";

@Injectable()
export class StateService {
  public constructor(@InjectRepository(State) private readonly stateModel: EntityRepository<State>) {}

  public async showAll({ offset = 0, limit, sort }: ShowAllWithSort, mapped?: Mapped<State>) {
    return this.stateModel.findAndCount(
      {},
      {
        offset,
        limit,
        orderBy: sort,
        populate: mapped,
      }
    );
  }

  public async findByID(id: string, mapped?: Mapped<State>) {
    return this.stateModel.findOne({ id }, mapped);
  }
}
