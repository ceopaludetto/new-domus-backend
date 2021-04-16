import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";

import { City } from "@/models";
import type { Mapped, ShowAllWithSort } from "@/utils/common.dto";

@Injectable()
export class CityService {
  public constructor(@InjectRepository(City) private readonly cityModel: EntityRepository<City>) {}

  public async showAll({ offset = 0, limit, sort }: ShowAllWithSort, mapped?: Mapped<City>) {
    return this.cityModel.findAndCount(
      {},
      {
        offset,
        limit,
        orderBy: sort,
        populate: mapped,
      }
    );
  }

  public async findByID(id: string, mapped?: Mapped<City>) {
    return this.cityModel.findOne({ id }, mapped);
  }

  public async findByState(stateID: string, mapped?: Mapped<City>) {
    return this.cityModel.find(
      {
        state: { id: stateID },
      },
      {
        populate: mapped,
      }
    );
  }
}
