import {ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus} from "@nestjs/common";
import {FastifyRequest, FastifyReply} from "fastify";
import {ErrorCode} from "../config";

@Catch()
export class AppErrorGuard implements ExceptionFilter {
  catch(e: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<FastifyRequest>();
    const response = ctx.getResponse<FastifyReply>();

    console.error("exception: ", e);
    if (e instanceof HttpException) {
      response.status(e.getStatus()).send(e["message"]);
    } else if (typeof e !== "number") {
      let data: any = {};
      if (e.code) data = {code: 0, msg: e.code};
      else if (e.clientVersion) {
        let code = parseInt(e.message) || ErrorCode.UNKNOWN_ERROR;
        data = {
          code: 0,
          msg: getErrorStr(code),
        };
      } else if (e.stack)
        data = {
          code: 0,
          msg: getErrorStr(ErrorCode.PARAMS_INVALID),
        };
      else if (e.error_code) data = {code: 0, msg: getErrorStr(e.error_code), data: e.data};
      else
        data = {
          code: 0,
          msg: getErrorStr(ErrorCode.UNKNOWN_ERROR),
        };
      response.status(HttpStatus.OK).send(data);
    } else {
      const data: any = {code: 0, msg: getErrorStr(e)};
      response.status(HttpStatus.OK).send(data);
    }
  }
}

const getErrorStr = (errCode: number): string => {
  return ErrorCode[errCode];
};
