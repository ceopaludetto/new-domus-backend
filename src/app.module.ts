import { EntityCaseNamingStrategy } from "@mikro-orm/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { MailerModule } from "@nestjs-modules/mailer";
import { PugAdapter } from "@nestjs-modules/mailer/dist/adapters/pug.adapter";
import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ServeStaticModule } from "@nestjs/serve-static";
import { GraphQLUpload, graphqlUploadExpress } from "graphql-upload";
import { LoggerModule, PinoLogger } from "nestjs-pino";
import path from "path";

import {
  AuthenticationModule,
  CondominiumModule,
  PersonModule,
  QueueModule,
  StateModule,
  CityModule,
  UserModule,
  BlockModule,
  UploadModule,
  ImageModule,
  LocalModule,
} from "@/components";
import * as entities from "@/models";
import type { ContextType } from "@/utils/common.dto";
import { APP_NAME } from "@/utils/constants";
import { validate } from "@/utils/validations/configuration";

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        base: { name: APP_NAME },
        messageKey: "message",
        autoLogging: process.env.NODE_ENV === "production",
        level: process.env.NODE_ENV !== "production" ? "debug" : "info",
        prettyPrint:
          process.env.NODE_ENV !== "production"
            ? {
                translateTime: "dd/mm/yyyy, hh:MM:ss:l",
                ignore: "context,pid,req",
                levelFirst: true,
              }
            : undefined,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV ?? "development"}`,
      validate,
    }),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService, PinoLogger],
      useFactory: (configService: ConfigService, logger: PinoLogger) => ({
        type: configService.get("DATABASE_TYPE"),
        dbName: configService.get("DATABASE_DB"),
        host: configService.get("DATABASE_HOST"),
        port: configService.get("DATABASE_PORT"),
        user: configService.get("DATABASE_USERNAME"),
        password: configService.get("DATABASE_PASSWORD"),
        namingStrategy: EntityCaseNamingStrategy,
        debug: configService.get("DATABASE_LOGGER") && ["query", "query-params"],
        entities: Object.values(entities).filter((x) => typeof x === "function") as any,
        discovery: { disableDynamicFileAccess: true }, // due to webpack usage
        tsNode: false,
        logger: (msg: string) => logger.debug(msg),
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>("MAILER_HOST"),
          port: configService.get<number>("MAILER_PORT"),
          auth: {
            user: configService.get<string>("MAILER_AUTH_USER"),
            pass: configService.get<string>("MAILER_AUTH_PASS"),
          },
        },
        template: {
          dir: configService.get("MAILER_TEMPLATES"),
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    GraphQLModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: configService.get<string>("GRAPHQL_SCHEMA") ?? true,
        installSubscriptionHandlers: true,
        debug: process.env.NODE_ENV === "development",
        playground: process.env.NODE_ENV === "development",
        introspection: process.env.NODE_ENV === "development",
        cors: false,
        uploads: false,
        resolvers: { Upload: GraphQLUpload },
        context: ({ req, res }: ContextType) => ({ req, res }),
      }),
    }),
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => [
        {
          rootPath: path.resolve(configService.get<string>("UPLOADS_PATH", "/uploads")),
        },
      ],
    }),
    QueueModule,
    UserModule,
    PersonModule,
    AuthenticationModule,
    CondominiumModule,
    StateModule,
    CityModule,
    BlockModule,
    UploadModule,
    ImageModule,
    LocalModule,
  ],
})
export class ApplicationModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(graphqlUploadExpress()).forRoutes("/graphql");
  }
}
