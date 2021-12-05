import type { Arguments, CommandBuilder } from "yargs";
import { Container } from "typedi";

import { BaseOptions } from "../types/BaseOptions";
import { ERC20TokenFactoryService } from "../services/ERC20TokenFactory";
import { KeystoreService } from "../services/KeystoreService";
import { WrongPasswordException } from "../exceptions/WrongPasswordException";

interface BalanceOptions extends BaseOptions {}

export const command: string = "balance";
export const desc: string = "Get balance of your account";

export const builder: CommandBuilder<BalanceOptions, BalanceOptions> = (
  yargs
) => yargs;

export const handler = async (
  argv: Arguments<BalanceOptions>
): Promise<void> => {
  const { contract, keystore, password } = argv;

  try {
    const keystoreService = Container.get(KeystoreService);
    const tokenFactoryService = Container.get(ERC20TokenFactoryService);

    const account = keystoreService.decrypt(keystore, password);
    const token = tokenFactoryService.create(contract!!, account);

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
