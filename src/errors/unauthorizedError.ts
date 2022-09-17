import { CustomError } from "./customError";
import { StatusCodes } from "http-status-codes";
export class UnauthorizedError extends CustomError {
  statusCode = StatusCodes.UNAUTHORIZED;
  constructor(message: string) {
    super(message);
  }
}
