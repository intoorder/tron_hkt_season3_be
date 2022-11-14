import {Body, Controller, Get, Post, Request, UseGuards} from "@nestjs/common";
import {okResult, Result, errorResult} from "../config";
import * as Joi from "joi";
import {encode, decode} from "string-encode-decode";
import * as MeditationService from "./meditation.service";
import {PrismaService} from "../provider";
import {JwtAuthGuard} from "../guard";

@UseGuards(JwtAuthGuard)
@Controller("meditation")
export class MeditationController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post("start")
  async startGame(@Request() request: any): Promise<Result<string>> {
    const wallet_address = request.user.uid;
    const randomNumber = MeditationService.randomIntFromInterval(1, 5);
    const data = encode(randomNumber.toString());

    //Save the random number
    await this.prismaService.user.update({
      where: {
        address: wallet_address,
      },
      data: {
        random_number: randomNumber,
        last_updated_at: new Date(),
      },
    });

    return okResult({data: data});
  }

  @Post("guess")
  async guessNumber(@Request() request: any, @Body() body): Promise<Result<any>> {
    let isCorrect = 0;
    const wallet_address = request.user.uid;
    const reqData = await Joi.object()
      .keys({
        guess: Joi.number(),
      })
      .validateAsync({...body});

    const result = await this.prismaService.user.findFirst({
      where: {
        address: wallet_address,
      },
    });

    if (!result) {
      return errorResult({message: "Incorrect wallet address"});
    }

    let bonusToken = 0;

    if (result && result.random_number === reqData.guess) {
      bonusToken = 100;
      isCorrect = 1;
    }

    const randomNumber = MeditationService.randomIntFromInterval(10, 1000000);

    //Reset random number
    const newUser = await this.prismaService.user.update({
      where: {
        address: wallet_address,
      },
      data: {
        token_total: {increment: bonusToken},
        random_number: randomNumber,
        last_updated_at: new Date(),
      },
    });

    return okResult({data: {is_correct: isCorrect, token_total: newUser?.token_total}});
  }
}
