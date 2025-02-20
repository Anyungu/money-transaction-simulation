import { CustomError } from "./CustomError.ts";

export default class BadRequestError extends CustomError {
  private static readonly _statusCode = 400;
  private readonly _code: number;
  private readonly _logging: boolean;
  private readonly _context: { [key: string]: any };
  private readonly _customMessage: string;

  constructor(params?: {
    code?: number;
    message?: string;
    customMessage?: string;
    logging?: boolean;
    context?: { [key: string]: any };
  }) {
    const { code, message, logging, customMessage, context } = params || {};

    super(message || customMessage || "Bad request");
    this._code = code || BadRequestError._statusCode;
    this._logging = logging || false;
    this._context = context || {};
    this._customMessage = customMessage || "Bad Request";

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  get errors() {
    return [{ message: this._customMessage, context: this._context }];
  }

  get statusCode() {
    return this._code;
  }

  get logging() {
    return this._logging;
  }
}
