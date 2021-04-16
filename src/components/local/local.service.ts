import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";

import { Local } from "@/models";
import type { ShowAll, Mapped } from "@/utils/common.dto";

@Injectable()
export class LocalService {
  public constructor(@InjectRepository(Local) private readonly localModel: EntityRepository<Local>) {}

  public async showAll({ offset = 0, limit }: ShowAll, mapped?: Mapped<Local>) {
    return this.localModel.findAndCount(
      {},
      {
        offset,
        limit,
        populate: mapped,
      }
    );
  }

  public async findByID(id: string, mapped?: Mapped<Local>) {
    return this.localModel.findOne({ id }, mapped);
  }
}
