import type { Arguments, CommandBuilder } from "yargs";
import { Container } from "typedi";

import { BaseOptions } from "../types/BaseOptions";
import { ERC20TokenFactoryService } from "../services/ERC20TokenFactory";
import { KeystoreService } from "../services/KeystoreService";
import { WrongPasswordException } from "../exceptions/WrongPasswordException";
import { PrintService } from "../services/PrintService";
import { Web3Service } from "../services/Web3Service";

interface TransferOptions extends BaseOptions {
  sum: number;
  to: string;
}

export const command: string = "transfer";
export const desc: string = "Transfer <sum> from your balance to <to>";

export const builder: CommandBuilder<TransferOptions, TransferOptions> = (
  yargs
) =>
  yargs
    .positional("sum", { type: "number", alias: "s", demandOption: true })
    .options({
      to: {
        type: "string",
        alias: "t",
        demandOption: true,
      },
    });

export const handler = async (
  argv: Arguments<TransferOptions>
): Promise<void> => {
  const { contract, keystore, password, sum, to } = argv;
  const printService = Container.get(PrintService);

  try {
    const keystoreService = Container.get(KeystoreService);
    const tokenFactoryService = Container.get(ERC20TokenFactoryService);

    const account = keystoreService.decrypt(keystore, password);
    const token = tokenFactoryService.create(contract!!, account);

    await token.transfer(to, sum, account);

    const symbol = await token.getSymbol();

    printService.success(`Successfully transferred ${sum} ${symbol}`);
  } catch (e: unknown) {
    const error = e as Error;

    if (error instanceof WrongPasswordException) {
      printService.error("Password verification failed");
    } else if (error.message === "Contract not found") {
      printService.error("Contract not found");
    } else {
      throw error;
    }
  }
};
