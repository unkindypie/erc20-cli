import { Account } from "web3-core";

import { ERC20Token } from "../models/ERC20Token";
import { addresses } from "../web3-client";
import { maxcoinTokenABI } from "../abis/maxcoin";

export class ERC20TokenFactory {
  static create(contractAddress: string, account: Account): ERC20Token {
    switch (contractAddress) {
      case addresses.MAXCOIN_CONTRACT:
        return new ERC20Token(
          maxcoinTokenABI,
          contractAddress,
          account.address
        );
      default:
        throw new Error(`Contract not found`);
    }
  }
}
