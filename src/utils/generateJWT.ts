import jwt from "jsonwebtoken";

export const generateJWT = (payload: { userId: number }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string);
  return token;
};
