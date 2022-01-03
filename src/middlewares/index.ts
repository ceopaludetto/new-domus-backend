import { INestApplication, ValidationPipe } from "@nestjs/common";
import cookie from "cookie-parser";
import helmet from "helmet";

import { ToPlainPipe } from "@/utils/plugins/pipes";

export function installMiddlewares(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
    new ToPlainPipe()
  );

  app.use(cookie());
  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: ["AccessToken"],
    allowedHeaders: ["Condominium", "Authorization", "Content-Type", "Origin"],
  });

  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
}
