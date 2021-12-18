import type { Contract } from "web3-eth-contract";
import { Container } from "typedi";

import { Web3Service } from "../services/Web3Service";
import { Account, TransactionConfig } from "web3-core";

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

  async transfer(to: string, sum: number, account: Account): Promise<any> {
    const transactionData = this.contract.methods.transfer(to, sum).encodeABI();

    const gasEstimation =
      30000 + (await this.contract.methods.transfer(to, sum).estimateGas());

    const rawTransaction: TransactionConfig = {
      data: transactionData,
      gas: (gasEstimation * 1.1) ^ 0,
      gasPrice: 1,
      from: account.address,
      to: this.contract.options.address,
    };

    const signedTransaction = await account.signTransaction(rawTransaction);
    await this._web3Service.eth.sendSignedTransaction(
      signedTransaction.rawTransaction!
    );

    return rawTransaction;
  }
}
