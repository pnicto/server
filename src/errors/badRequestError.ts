import { CustomError } from "./customError";
import { StatusCodes } from "http-status-codes";
export class BadRequestError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST;
  constructor(message: string) {
    super(message);
  }
}
