import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../errors/customError";

export const errorHandler: ErrorRequestHandler = async (
  err,
  req,
  res,
  next
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: err.message });
};
