import "express";

import type { User } from "@/models";

declare module "express" {
  interface Request {
    user: User;
    condominium: string;
  }
}
