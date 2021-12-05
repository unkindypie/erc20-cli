import Web3 from "web3";
import { Service } from "typedi";

@Service()
export class Web3Service extends Web3 {
  constructor() {
    super(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }
}
