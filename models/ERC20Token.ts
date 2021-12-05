import type { Contract } from "web3-eth-contract";
import { Container } from "typedi";

import { Web3Service } from "../services/Web3Service";

export class ERC20Token {
  readonly myAddress: string;
  readonly contract: Contract;
  private readonly _web3Service = Container.get(Web3Service);

  constructor(abi: any, contractAddress: string, currentAddress: string) {
    this.myAddress = currentAddress;
    this.contract = new this._web3Service.eth.Contract(abi, contractAddress, {
      from: this.myAddress,
    });
  }

  async getBalance(address: string): Promise<number> {
    return await this.contract.methods.balanceOf(address).call();
  }

  async getSymbol(): Promise<string> {
    return await this.contract.methods.symbol().call();
  }

  async getOwnBalance(): Promise<number> {
    return await this.getBalance(this.myAddress);
  }

  async transfer(to: string, sum: number): Promise<boolean> {
    return await this.contract.methods.transfer(to, sum).send();
  }
}
