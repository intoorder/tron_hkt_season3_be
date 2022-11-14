import {Injectable, Logger} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";
import {PrismaService} from "../provider";
import {cronUtils, decrypt, encrypt} from "../utils";
import {WithdrawStatus} from "./withdraw.config";
import {ethers, utils} from "ethers";
import {appConfig} from "../config";
const TronWeb = require("tronweb");
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
const eventServer = new HttpProvider("https://api.shasta.trongrid.io");

@Injectable()
export class WithdrawCron {
  running = false;
  constructor(private readonly prismaService: PrismaService) {}

  @Cron(cronUtils.EVERY_THREE_SECONDS, {utcOffset: 0})
  async withdrawalCron() {
    if (this.running) return;
    try {
      this.running = true;

      const owner_pk_encrypted = (await this.prismaService.system_config.findUnique({where: {key: "owner_pk"}}))!.value;
      const owner_pk = decrypt(owner_pk_encrypted, appConfig().pk_secret);
      const nbt_address = (await this.prismaService.system_config.findUnique({where: {key: "nbt_address"}}))!.value;
      const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, owner_pk);
      const {abi} = await tronWeb.trx.getContract(nbt_address);
      const contract = tronWeb.contract(abi.entrys, nbt_address);

      const withdrawals = await this.prismaService.withdrawal.findMany({where: {status: WithdrawStatus.PENDING}});
      for (let i = 0; i < withdrawals.length; i++) {
        const withdraw = withdrawals[i];
        await this.prismaService.withdrawal.update({where: {id: withdraw.id}, data: {status: WithdrawStatus.PROCESSING}});
        try {
          const amoutToSend = ethers.utils.parseEther(`${withdraw.amount}`);
          const resp = await contract.methods.transfer(withdraw.address, amoutToSend).send();
          console.log("transfer:", resp);
          await this.prismaService.withdrawal.update({where: {id: withdraw.id}, data: {status: WithdrawStatus.DONE, tx_hash: resp}});
        } catch (e) {
          await this.prismaService.withdrawal.update({where: {id: withdraw.id}, data: {status: WithdrawStatus.FAILED, message: e}});
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.running = false;
    }
    return;
  }
}
