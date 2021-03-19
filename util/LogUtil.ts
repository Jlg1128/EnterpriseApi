/* eslint-disable import/prefer-default-export */
import * as fs from "fs";

export class LogUtil {
  static errLog(errMsg: string) {
    const path = `logs/httpError.log`;
    fs.appendFileSync(path, `${errMsg} \n`);
  }
}
