import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { UserModule } from "../user";
import { AuthenticationResolver } from "./authentication.resolver";
import { AuthenticationService } from "./authentication.service";
import { JwtStrategy } from "./jwt.strategy";

@Global()
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("AUTH_SECRET"),
        signOptions: { expiresIn: "15m" },
      }),
    }),
  ],
  providers: [JwtStrategy, AuthenticationResolver, AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
