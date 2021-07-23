import { INestApplication, ValidationPipe } from "@nestjs/common";
import { UserInputError } from "apollo-server-express";
import cookie from "cookie-parser";
import helmet from "helmet";

import { formatErrors } from "./validations/format";

export function installMiddlewares(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UserInputError("Erro de validação", formatErrors(errors)),
    })
  );

  app.use(cookie());
  app.enableCors({
    origin: true,
    credentials: true,
    allowedHeaders: ["Content-Type", "X-Access-Token", "X-Condominium", "Origin"],
    exposedHeaders: ["X-Access-Token"],
  });

  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
}
