import "reflect-metadata";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { addresses } from "./constants/addresses";

yargs(hideBin(process.argv))
  .parserConfiguration({ "parse-numbers": false })
  .commandDir("commands")
  .strict()
  .options("keystore", {
    type: "string",
    alias: "k",
    describe: "Keystore file path.",
  })
  .options("password", {
    type: "string",
    alias: "p",
  })
  .options("contract", {
    type: "string",
    default: addresses.MAXCOIN_CONTRACT,
    alias: "c",
  })
  .demandOption("keystore")
  .demandOption("password")
  .alias({ h: "help" }).argv;
