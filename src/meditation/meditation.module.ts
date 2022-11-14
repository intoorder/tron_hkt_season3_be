import {Module} from "@nestjs/common";
import * as MeditationService from "./meditation.service";
import {MeditationController} from "./meditation.controller";
import {PrismaService} from "../provider";

@Module({
  providers: [PrismaService],
  controllers: [MeditationController],
})
export class MeditationModule {}
