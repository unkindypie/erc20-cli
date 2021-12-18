import { Service } from "typedi";
import consola from "consola";

@Service()
export class PrintService {
  private _getAdditionalArgs(args: unknown[]) {
    return args.length > 1 ? args.splice(1) : [];
  }

  success(...args: unknown[]) {
    consola.success(args[0], ...this._getAdditionalArgs(args));
  }

  print(...args: unknown[]) {
    consola.log(args[0], ...this._getAdditionalArgs(args));
  }

  highlighted(...args: unknown[]) {
    consola.log(args[0], ...this._getAdditionalArgs(args));
  }

  error(...args: unknown[]) {
    consola.error(args[0], ...this._getAdditionalArgs(args));
  }
}
