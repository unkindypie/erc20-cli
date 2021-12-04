import { Contract } from "web3-eth-contract";

import { web3 } from "../web3-client";

export class ERC20Token {
  readonly myAddress: string;
  readonly contract: Contract;

  constructor(abi: any, contractAddress: string, yourAddress: string) {
    this.myAddress = yourAddress;
    this.contract = new web3.eth.Contract(abi, contractAddress, {
      from: this.myAddress,
    });
  }

  async getBalance(address: string) {
    return (await this.contract.methods.balanceOf(address).call()) as number;
  }

  async getSymbol() {
    return (await this.contract.methods.symbol().call()) as string;
  }

  async getOwnBalance() {
    return await this.getBalance(this.myAddress);
  }

  async transfer(to: string, summ: number) {
    await this.contract.methods.transfer(to, summ).send();
  }
}
