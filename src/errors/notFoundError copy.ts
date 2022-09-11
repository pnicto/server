import { CustomError } from "./customError";
import { StatusCodes } from "http-status-codes";
export  class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message);
  }
  statusCode = StatusCodes.NOT_FOUND;
}
