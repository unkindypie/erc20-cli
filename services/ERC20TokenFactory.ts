import type { Account } from "web3-core";
import { Service } from "typedi";

import { ERC20Token } from "../models/ERC20Token";
import { addresses } from "../constants/addresses";
import { maxcoinTokenABI } from "../abis/maxcoin";
import { erc20TokenABI } from "../abis/erc20";

@Service()
export class ERC20TokenFactoryService {
  create(contractAddress: string, account: Account): ERC20Token {
    switch (contractAddress) {
      case addresses.MAXCOIN_CONTRACT:
        return new ERC20Token(
          maxcoinTokenABI,
          contractAddress,
          account.address
        );
      default:
        return new ERC20Token(erc20TokenABI, contractAddress, account.address);
    }
  }
}
