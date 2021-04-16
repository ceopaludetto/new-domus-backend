import { Resolver, Args } from "@nestjs/graphql";
import { connectionFromArraySlice } from "graphql-relay";

import { Image } from "@/models";
import { ShowAllQuery } from "@/utils/plugins";
import { ConnectionArgs } from "@/utils/plugins/pagination.parameters";

import { ImageService } from "./image.service";

@Resolver(() => Image)
export class ImageResolver {
  public constructor(private readonly imageService: ImageService) {}

  @ShowAllQuery(() => Image)
  public async showImages(@Args() args: ConnectionArgs) {
    const { offset, limit } = args.paginationParams();
    const [images, count] = await this.imageService.showAll({}, { offset, limit });

    return connectionFromArraySlice(images, args, { arrayLength: count, sliceStart: offset ?? 0 });
  }
}
