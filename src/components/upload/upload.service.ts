import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createWriteStream, ensureDir, remove } from "fs-extra";
import type { FileUpload } from "graphql-upload";
import path from "path";
import sharp from "sharp";
import shortid from "shortid";

@Injectable()
export class UploadService {
  public constructor(private readonly configService: ConfigService) {}

  public dir = this.configService.get<string>("UPLOADS_PATH", "uploads");

  public async upload({ createReadStream }: FileUpload) {
    const file = `${shortid.generate()}.webp`;
    const filePath = path.resolve(this.dir, file);

    const stream = createReadStream();

    return new Promise<string>((resolve, reject) => {
      stream
        .pipe(sharp().webp())
        .pipe(createWriteStream(filePath))
        .on("finish", () => {
          resolve(file);
        })
        .on("error", reject);
    });
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
