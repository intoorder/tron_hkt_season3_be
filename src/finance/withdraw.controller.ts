import {Controller, Post, Request, UseGuards} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {ErrorCode, okResult} from "../config";
import {JwtAuthGuard} from "../guard";
import {PrismaService} from "../provider";
import {WithdrawStatus} from "./withdraw.config";

@UseGuards(JwtAuthGuard)
@Controller()
export class WithdrawController {
  constructor(private readonly jwtService: JwtService, private readonly prismaService: PrismaService) {}
  @Post("/withdraw")
  async withdraw(@Request() request: any): Promise<any> {
    const user = await this.prismaService.user.findUnique({where: {address: request.user.uid}});
    if (!user) throw ErrorCode.USER_NOT_EXIST;
    if (user.token_total < 100) throw ErrorCode.USER_BALANCE_LESS_THAN_100;

    const [updatedUser, withdrawal] = await this.prismaService.$transaction(async (prisma) => {
      const updatedUser = await prisma.user.update({
        where: {address: user.address},
        data: {
          token_total: {decrement: user.token_total},
        },
      });

      if (updatedUser.token_total < 0) {
        throw ErrorCode.USER_BALANCE_LESS_THAN_100;
      }

      const withdrawal = await prisma.withdrawal.create({
        data: {
          user_id: user.id,
          address: user.address,
          amount: user.token_total,
          status: WithdrawStatus.PENDING,
        },
      });
      return [updatedUser, withdrawal];
    });

    return okResult({
      data: {
        withdrawal,
        token_total: updatedUser.token_total,
      },
    });
  }
}
