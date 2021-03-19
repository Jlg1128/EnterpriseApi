/* eslint-disable max-len */
import { ResultVO } from '../vo/ResultVO';

export enum ResStatusCode {
  SUCCESS = 200,
  ERROR = 400,
  NOAUTH = 401,
  PARAMWRONG = 400,
}

export class MyResponse {
  static success(data = null, msg?: string): ResultVO {
    return new ResultVO(msg || "执行成功", ResStatusCode.SUCCESS, data, true);
  }

  static error(msg?: string): ResultVO {
    return new ResultVO(msg || "异常错误", ResStatusCode.ERROR, null, false);
  }

  static paramWrong(msg?: string): ResultVO {
    return new ResultVO(msg || "缺少参数", ResStatusCode.PARAMWRONG, null, false);
  }

  static noAuth(msg?: string): ResultVO {
    return new ResultVO(msg || "没有授权", ResStatusCode.NOAUTH, null, false);
  }
}
