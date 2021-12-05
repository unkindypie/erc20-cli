import type { Arguments, CommandBuilder } from "yargs";
import { Container } from "typedi";

import { BaseOptions } from "../types/BaseOptions";
import { ERC20TokenFactoryService } from "../services/ERC20TokenFactory";
import { KeystoreService } from "../services/KeystoreService";
import { WrongPasswordException } from "../exceptions/WrongPasswordException";

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

  try {
    const keystoreService = Container.get(KeystoreService);
    const tokenFactoryService = Container.get(ERC20TokenFactoryService);

    const account = keystoreService.decrypt(keystore, password);
    const token = tokenFactoryService.create(contract!!, account);

    const result = await token.transfer(to, sum);
    const symbol = await token.getSymbol();

    if (result) {
      console.log(`Successfully transferred ${sum} ${symbol}`);
      return;
    }

    console.log("Transfer failed.");
  } catch (e: unknown) {
    const error = e as Error;

    if (error instanceof WrongPasswordException) {
      console.log("Password verification failed");
    } else if (error.message === "Contract not found") {
      console.log("Contract not found");
    } else {
      throw error;
    }
  }
};
