import "express";

declare module "express" {
  interface Request {
    condominium: string;
  }
}
