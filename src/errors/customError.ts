import { StatusCodes } from "http-status-codes";

export class CustomError extends Error {
  statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR;
  constructor(message: string) {
    super(message);
  }
}
