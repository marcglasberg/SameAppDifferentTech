import { runConfig } from '../../inject';

export function print(info: any) {
  if (runConfig && runConfig.ifPrintsDebugInfoToConsole) console.log('' + info);
}

export function printError(info: any, error: any) {
  if (runConfig && runConfig.ifPrintsDebugInfoToConsole) console.error('' + info, error);
}

/** Round the given number to two decimal places. */
export function round(value: number): number {
  return Math.round(value * 100) / 100;
}

