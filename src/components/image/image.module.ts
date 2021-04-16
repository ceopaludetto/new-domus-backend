import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Image } from "@/models";

import { ImageResolver } from "./image.resolver";
import { ImageService } from "./image.service";

@Module({
  imports: [MikroOrmModule.forFeature([Image])],
  providers: [ImageResolver, ImageService],
  exports: [ImageService],
})
export class ImageModule {}
