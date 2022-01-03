import type { FindOptions } from "@mikro-orm/core";
import type { Request, Response } from "express";

export interface ContextType {
  req: Request;
  res: Response;
}

export interface TokenPayload {
  id: string;
}

export type Mapped<T> = FindOptions<T>["populate"];
