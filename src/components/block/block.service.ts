import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { UserInputError } from "apollo-server-express";

import { UploadService } from "@/components/upload";
import { Block } from "@/models";
import type { Mapped, ShowAll } from "@/utils/common.dto";

import type { BlockInsertInput, BlockUpdateInput } from "./block.dto";

@Injectable()
export class BlockService {
  public constructor(
    @InjectRepository(Block) private readonly blockModel: EntityRepository<Block>,
    private readonly uploadService: UploadService
  ) {}

  public async showAll(condominium: string, { skip = 0, take }: ShowAll, mapped?: Mapped<Block>) {
    return this.blockModel.find(
      {
        condominium,
      },
      {
        offset: skip,
        limit: take,
        populate: mapped,
      }
    );
  }

  public async findByID(id: string, mapped?: Mapped<Block>) {
    return this.blockModel.findOne({ id }, mapped);
  }

  public async create({ images, ...data }: BlockInsertInput, mapped?: Mapped<Block>) {
    const block = this.blockModel.create(data);

    if (images) {
      const uploads = await this.uploadService.upload(await Promise.all(images));

      block.images?.set(
        uploads.map((upload) => {
          upload.block = block;

          return upload;
        })
      );
    }

    await this.flush(block);

    return this.populate(block, mapped);
  }

  public async update(id: string, { images, ...data }: BlockUpdateInput, mapped?: Mapped<Block>) {
    const block = await this.blockModel.findOne({ id });

    if (!block) {
      throw new UserInputError("Block not found");
    }

    if (images) {
      const uploads = await this.uploadService.upload(await Promise.all(images));

      if (block.images) {
        await Promise.all((await block.images.loadItems()).map((image) => this.uploadService.delete(image.name)));
      }

      block.images?.set(
        uploads.map((upload) => {
          upload.block = block;

          return upload;
        })
      );
    }

    this.blockModel.assign(block, data);

    await this.flush(block);

    return this.populate(block, mapped);
  }

  public async delete(id: string, mapped?: Mapped<Block>) {
    const block = await this.blockModel.findOne({ id });

    if (!block) {
      throw new UserInputError("Block not found");
    }

    const populated = await this.populate(block, mapped);

    await this.blockModel.removeAndFlush(block);

    if (block.images) {
      await Promise.all((await block.images.loadItems()).map((image) => this.uploadService.delete(image.name)));
    }

    return populated;
  }

  public async flush(block: Block) {
    await this.blockModel.persistAndFlush(block);
  }

  public async populate(block: Block, fields?: Mapped<Block>) {
    if (!fields) {
      throw new UserInputError("Provide populate fields");
    }

    return this.blockModel.populate(block, fields);
  }
}
