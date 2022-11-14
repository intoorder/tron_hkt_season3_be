import {Body, Controller, Get, Post} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import Joi from "joi";
import {randomIntFromInterval} from "../meditation/meditation.service";
import {PrismaService} from "../provider";
import {ErrorCode, okResult} from "../config";
const TronWeb = require("tronweb");

@Controller()
export class AuthenController {
  constructor(private readonly jwtService: JwtService, private readonly prismaService: PrismaService) {}
  @Post("/auth/login")
  async login(@Body() body): Promise<any> {
    const {wallet_address, signature} = await Joi.object()
      .keys({
        wallet_address: Joi.string().required(),
        signature: Joi.string().required(),
      })
      .validateAsync({...body});
    var str = "Welcome to NextBrainApp";
    var hexStrWithout0x = TronWeb.toHex(str).replace(/^0x/, "");
    var byteArray = TronWeb.utils.code.hexStr2byteArray(hexStrWithout0x);
    var strHash = TronWeb.sha3(byteArray).replace(/^0x/, "");
    try {
      var res = await TronWeb.Trx.verifyMessageV2(strHash, signature, wallet_address);
      if (res) {
        const randomNumber = randomIntFromInterval(1, 5);
        await this.prismaService.user.upsert({
          where: {
            address: wallet_address,
          },
          create: {
            address: wallet_address,
            random_number: randomNumber,
            token_total: 0,
            last_updated_at: new Date(),
          },
          update: {
            random_number: randomNumber,
            last_updated_at: new Date(),
          },
        });

        const user = await this.prismaService.user.findUnique({
          where: {address: wallet_address},
        });

        return okResult({
          data: {
            token: this.jwtService.sign({
              uid: wallet_address,
            }),
            token_total: user?.token_total ?? 0,
          },
        });
      }
    } catch (e) {
      throw ErrorCode.LOGIN_FAILED;
    }
  }
}
