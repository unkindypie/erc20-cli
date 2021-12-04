import yargs from "yargs";
import { hideBin } from "yargs/helpers";

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
  .demandOption("keystore")
  .demandOption("password")
  .alias({ h: "help" }).argv;
