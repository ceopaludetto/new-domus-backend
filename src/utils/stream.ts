export function streamToPromise(stream: NodeJS.ReadableStream | NodeJS.WritableStream) {
  return new Promise<Buffer | string>((resolve, reject) => {
    stream.on("finish", (value: Buffer | string) => resolve(value));
    stream.on("error", reject);
  });
}
