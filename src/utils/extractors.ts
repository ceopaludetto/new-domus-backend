import type { Request } from "express";
import { ExtractJwt } from "passport-jwt";

export const Extract = {
  accessToken: ExtractJwt.fromAuthHeaderAsBearerToken(),
  refreshToken: (request: Request) => {
    const token: string = request.cookies.RefreshToken;
    if (!token) return null;

    return token;
  },
  condominium: (request: Request) => {
    const id = request.header("Condominium");
    if (!id) return null;

    return id;
  },
};
