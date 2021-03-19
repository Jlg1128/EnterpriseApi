/* eslint-disable import/prefer-default-export */
export class ResultVO {
  msg: string = '';

  code: number = 200;

  data: Object = null;

  success: boolean = false;

  constructor(msg: string, code: number, data: Object, success: boolean) {
    this.code = code;
    this.msg = msg;
    this.data = data;
    this.success = success;
  }
}
