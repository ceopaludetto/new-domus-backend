import type { MikroORMOptions } from "@mikro-orm/core";
import * as Yup from "yup";

const EnviromentSchema = Yup.object({
  DATABASE_CLIENT: Yup.string(),
  DATABASE_TYPE: Yup.mixed<MikroORMOptions["type"]>()
    .oneOf(["mariadb", "mongo", "mysql", "postgresql", "sqlite"])
    .required(),
  DATABASE_HOST: Yup.string().when("DATABASE_TYPE", {
    is: "sqlite",
    then: Yup.string(),
    otherwise: Yup.string().required(),
  }),
  DATABASE_PORT: Yup.number().when("DATABASE_TYPE", {
    is: "sqlite",
    then: Yup.number(),
    otherwise: Yup.number().required(),
  }),
  DATABASE_DB: Yup.string().required(),
  DATABASE_USERNAME: Yup.string().when("DATABASE_TYPE", {
    is: "sqlite",
    then: Yup.string(),
    otherwise: Yup.string().required(),
  }),
  DATABASE_PASSWORD: Yup.string().when("DATABASE_TYPE", {
    is: "sqlite",
    then: Yup.string(),
    otherwise: Yup.string().required(),
  }),
  DATABASE_LOGGER: Yup.bool(),

  QUEUE_HOST: Yup.string().required(),
  QUEUE_PORT: Yup.number().required(),

  MAILER_HOST: Yup.string().required(),
  MAILER_PORT: Yup.number().required(),
  MAILER_AUTH_USER: Yup.string().required(),
  MAILER_AUTH_PASS: Yup.string().required(),
  MAILER_TEMPLATES: Yup.string().required(),

  AUTH_SECRET: Yup.string().required(),

  GRAPHQL_SCHEMA: Yup.string(),

  AWS_HOST: Yup.string().required().default("localhost"),
  AWS_PORT: Yup.number().required().default(4566),
  AWS_REGION: Yup.string().required().default("us-east-1"),
  AWS_ACCESS_KEY_ID: Yup.string().required().default("test"),
  AWS_SECRET_ACCESS_KEY: Yup.string().required().default("test"),
  AWS_BUCKET: Yup.string().required().default("domusdev"),
}).required();

type EnviromentValues = Yup.InferType<typeof EnviromentSchema>;

export function validate(config: Record<string, any>) {
  try {
    EnviromentSchema.validateSync(config, { abortEarly: true });

    return config as EnviromentValues;
  } catch (error) {
    throw new Error(error.message);
  }
}
