import { S3 } from "aws-sdk";

export const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "test",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "test",
  },
  endpoint: `http://${process.env.AWS_HOST}:${process.env.AWS_PORT}`,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});
