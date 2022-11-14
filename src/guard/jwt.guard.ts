import {Injectable} from "@nestjs/common";
import {AuthGuard, PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {appConfig} from "../config";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig().jwt_secret,
    });
  }

  async validate(payload: any) {
    // this is request.user.
    return {
      uid: payload.uid,
    };
  }
}
