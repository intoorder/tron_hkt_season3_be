import {CacheModule, Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {appConfig} from "./config";
// import {RedisBootstrap} from "./service";
import {AppController} from "./controller";
import {MeditationModule} from "./meditation/meditation.module";
import {AppErrorGuard, JwtStrategy} from "./guard";
import {PrismaService} from "./provider";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {APP_FILTER} from "@nestjs/core";
import {AuthenController} from "./authen/authen.controller";
import {WithdrawController} from "./finance/withdraw.controller";
import {ScheduleModule} from "@nestjs/schedule";
import {WithdrawCron} from "./finance/withdraw.cron";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    CacheModule.registerAsync({
      useFactory: () => ({
        ttl: appConfig().cache_ttl,
        max: appConfig().cache_max,
      }),
    }),
    MeditationModule,
    ConfigModule.forRoot({
      envFilePath: ".env",
      load: [appConfig],
      expandVariables: true,
    }),
    CacheModule.registerAsync({
      useFactory: () => ({
        ttl: appConfig().cache_ttl,
        max: appConfig().cache_max,
      }),
    }),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: appConfig().jwt_secret,
        signOptions: {
          expiresIn: appConfig().jwt_expires_in,
          issuer: appConfig().jwt_issuer,
        },
      }),
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, AuthenController, WithdrawController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppErrorGuard,
    },
    JwtStrategy,
    PrismaService,
    WithdrawCron,
  ],
})
export class AppModule {}
