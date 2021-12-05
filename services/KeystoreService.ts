import { readFileSync } from "fs";
import { join } from "path";
import type { Account } from "web3-core";
import { Service } from "typedi";

import { WrongPasswordException } from "../exceptions/WrongPasswordException";
import { Web3Service } from "../services/Web3Service";

@Service()
export class KeystoreService {
  constructor(private readonly _web3Service: Web3Service) {}

  decrypt(keystorePath: string, password: string): Account {
    let path = keystorePath;

    if (keystorePath[0] !== "/") {
      path = join(__dirname, keystorePath);
    }

    const keystoreContents = JSON.parse(readFileSync(path).toString());

    try {
      const decryptedAccount = this._web3Service.eth.accounts.decrypt(
        keystoreContents,
        password
      );

      return decryptedAccount;
    } catch (e: unknown) {
      const error = e as Error;

      if (error.message == "Key derivation failed - possibly wrong password") {
        throw new WrongPasswordException(error.message);
      }

      throw error;
    }
  }
}
