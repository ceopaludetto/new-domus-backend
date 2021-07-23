import { Module, Global } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { UserModule } from "@/components/user";

import { AuthenticationResolver } from "./authentication.resolver";
import { AuthenticationService } from "./authentication.service";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Global()
@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("AUTH_SECRET"),
        signOptions: { expiresIn: "1h" },
      }),
    }),
  ],
  providers: [AuthenticationService, AuthenticationResolver, JwtStrategy],
  exports: [AuthenticationService, PassportModule],
})
export class AuthenticationModule {}
