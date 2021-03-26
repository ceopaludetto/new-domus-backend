import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { UploadModule } from "@/components/upload";
import { Block } from "@/models";

import { BlockResolver } from "./block.resolver";
import { BlockService } from "./block.service";

@Module({
  imports: [MikroOrmModule.forFeature([Block]), UploadModule],
  providers: [BlockResolver, BlockService],
  exports: [BlockService],
})
export class BlockModule {}
