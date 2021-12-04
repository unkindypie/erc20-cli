import type { Arguments, CommandBuilder } from "yargs";

import { addresses } from "../web3-client";
import { BaseOptions } from "../types/BaseOptions";
import { ERC20TokenFactory } from "../services/ERC20TokenFactory";
import { KeystoreService } from "../services/KeystoreService";
import { WrongPasswordException } from "../exceptions/WrongPasswordException";

interface Options extends BaseOptions {
  contract: string | undefined;
}

export const command: string = "balance";
export const desc: string = "Get balance of your account";

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.options({
    contract: {
      type: "string",
      default: addresses.MAXCOIN_CONTRACT,
      alias: "c",
    },
  });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { contract, keystore, password } = argv;

  try {
    const account = KeystoreService.decrypt(keystore, password);
    const token = ERC20TokenFactory.create(contract!!, account);

    const balance = await token.getOwnBalance();
    const symbol = await token.getSymbol();

    console.log(`Symbol: ${symbol}`);
    console.log(`Balance: ${balance} ${symbol}`);
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
