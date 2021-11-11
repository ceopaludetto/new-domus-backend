import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { useContainer as installClassValidationContainer } from "class-validator";
import { Logger } from "nestjs-pino";

import { installMiddlewares } from "@/middlewares";

import { ApplicationModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(ApplicationModule, {
    bufferLogs: true,
    autoFlushLogs: true,
  });
  const logger = app.get(Logger);
  app.useLogger(logger);

  installClassValidationContainer(app.select(ApplicationModule), { fallbackOnErrors: true });
  installMiddlewares(app);

  const port = process.env.PORT || 3333;
  await app.listen(port);

  logger.log(`Application listen in ${await app.getUrl()}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

// eslint-disable-next-line no-console
bootstrap().catch(console.error);
