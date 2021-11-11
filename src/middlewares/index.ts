import { INestApplication, ValidationPipe } from "@nestjs/common";
import cookie from "cookie-parser";
import helmet from "helmet";

export function installMiddlewares(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
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
