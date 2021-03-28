import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createWriteStream, ensureDir, remove, stat } from "fs-extra";
import type { FileUpload } from "graphql-upload";
import path from "path";
import sharp from "sharp";
import shortid from "shortid";

import { Image } from "@/models";
import { streamToPromise } from "@/utils/stream";

@Injectable()
export class UploadService {
  public constructor(private readonly configService: ConfigService) {}

  public dir = this.configService.get<string>("UPLOADS_PATH", "uploads");

  public async upload(files: FileUpload[]): Promise<Image[]> {
    return Promise.all(
      files.map(async ({ createReadStream }) => {
        const file = `${shortid.generate()}.webp`;
        const filePath = path.resolve(this.dir, file);

        const stream = createReadStream();

        await streamToPromise(stream.pipe(sharp().webp({ quality: 60 })).pipe(createWriteStream(filePath)));

        const { width, height } = await sharp(filePath).metadata();

        const small = Math.min(width ?? 0, height ?? 0);
        const big = Math.max(width ?? 0, height ?? 0);

        const aspectRatio = small / big;

        const { size } = await stat(filePath);

        return Image.create({ name: file, aspectRatio, ext: "webp", width, height, size });
      })
    );
  }

  public async delete(file: string) {
    const filePath = path.resolve(this.dir, file);

    return remove(filePath);
  }

  public async ensure() {
    const dirPath = this.configService.get<string>("UPLOADS_PATH", "uploads");
    return ensureDir(path.resolve(dirPath));
  }
}
