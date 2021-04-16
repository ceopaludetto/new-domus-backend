import { EntityRepository, FilterQuery } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";

import { Image } from "@/models";
import type { ShowAll } from "@/utils/common.dto";

@Injectable()
export class ImageService {
  public constructor(@InjectRepository(Image) private readonly imageModel: EntityRepository<Image>) {}

  public async showAll(where: FilterQuery<Image> = {}, { offset = 0, limit }: ShowAll) {
    return this.imageModel.findAndCount(where, {
      limit,
      offset,
    });
  }
}
