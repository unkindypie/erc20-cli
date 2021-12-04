import { readFileSync } from "fs";
import { join } from "path";
import { Account } from "web3-core";
import { WrongPasswordException } from "../exceptions/WrongPasswordException";

import { web3 } from "../web3-client";

export class KeystoreService {
  static decrypt(keystorePath: string, password: string): Account {
    let path = keystorePath;

    if (keystorePath[0] !== "/") {
      path = join(__dirname, keystorePath);
    }

    const keystoreContents = JSON.parse(readFileSync(path).toString());

    try {
      const decryptedAccount = web3.eth.accounts.decrypt(
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
