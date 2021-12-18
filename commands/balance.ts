import type { Arguments, CommandBuilder } from "yargs";
import { Container } from "typedi";

import type { BaseOptions } from "../types/BaseOptions";
import { WrongPasswordException } from "../exceptions/WrongPasswordException";
import { ERC20TokenFactoryService } from "../services/ERC20TokenFactory";
import { KeystoreService } from "../services/KeystoreService";
import { PrintService } from "../services/PrintService";

interface BalanceOptions extends BaseOptions {
  address?: string;
}

export const command: string = "balance";
export const desc: string =
  "Get balance of your account. If <address> is provided, it will be used instead.";

export const builder: CommandBuilder<BalanceOptions, BalanceOptions> = (
  yargs
) =>
  yargs.options({
    address: {
      type: "string",
      alias: "a",
      demandOption: false,
      description:
        "Optionally you could get balance of another address." +
        " By default, address of current account will be used.",
    },
  });

export const handler = async (
  argv: Arguments<BalanceOptions>
): Promise<void> => {
  const { contract, keystore, password, address } = argv;
  const printService = Container.get(PrintService);

  try {
    const keystoreService = Container.get(KeystoreService);
    const tokenFactoryService = Container.get(ERC20TokenFactoryService);

    const account = keystoreService.decrypt(keystore, password);
    const token = tokenFactoryService.create(contract!!, account);

    const balance = await token.getBalance(address ?? account.address);
    const symbol = await token.getSymbol();

    printService.success(`Balance: ${balance} ${symbol}`);
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
