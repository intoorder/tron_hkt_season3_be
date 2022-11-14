import {Body, Controller, Get, Post} from "@nestjs/common";
import {okResult, Result} from "../config";
import {encode, decode} from "string-encode-decode";

@Controller()
export class AppController {
  @Get("/alive")
  async index(): Promise<string> {
    const aliveNow = `Version 1.0 alive`;
    return aliveNow;
  }

  // Login
  // Connect with wallet and log in

  // Authenticate user here
  @Post("/zen/start")
  async startGame(@Body() body): Promise<Result<string>> {
    const randomNumber = 5 + Math.round(Math.random() * 7);
    const data = encode(randomNumber.toString());
    return okResult({data});
  }

  @Post("/zen/guess")
  async guessNumber(@Body() body): Promise<Result<number>> {
    const data = Math.random() < 0.5 ? 0 : 1;
    return okResult({data});
  }
}
