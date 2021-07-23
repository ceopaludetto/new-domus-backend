import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { FileUpload } from "graphql-upload";
import sharp from "sharp";
import shortid from "shortid";

import { Image } from "@/models";
import { s3 } from "@/utils/aws";

@Injectable()
export class UploadService {
  public constructor(private readonly configService: ConfigService) {}

  private async put(Body: Buffer, Key: string, ContentType: string) {
    return new Promise((resolve, reject) => {
      s3.putObject(
        { Body, Key, ContentType, Bucket: this.configService.get<string>("AWS_BUCKET", "domusdev") },
        (err, data) => {
          if (err) {
            return reject(err);
          }

          return resolve(data);
        }
      );
    });
  }

  public async upload(files: FileUpload[]): Promise<Image[]> {
    return Promise.all(
      files.map(async ({ createReadStream, mimetype }) => {
        const file = `${shortid.generate()}.webp`;

        const stream = await createReadStream()
          .pipe(sharp().webp({ quality: 60 }))
          .toBuffer();

        await this.put(stream, file, mimetype);

        const { width, height, size } = await sharp(stream).metadata();

        const small = Math.min(width ?? 0, height ?? 0);
        const big = Math.max(width ?? 0, height ?? 0);

        const aspectRatio = small / big;

        return Image.create({ name: file, aspectRatio, ext: "webp", width, height, size });
      })
    );
  }
}
