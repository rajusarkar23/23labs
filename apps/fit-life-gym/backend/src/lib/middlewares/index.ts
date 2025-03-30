import { NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import { responseMessages } from "../../config";

export default function otpVerifySession(
  req: Request,
  res: any,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"] ?? "";

  if (typeof authHeader !== "string") {
    console.log("no auth header available");
    return res.status(401).json({success: false, message: responseMessages.invalidJwt})
  }
  try {
    const decode = jwt.verify(authHeader, `${process.env.JWT_SECRET}`);
    //@ts-ignore
    const userId = decode.userId;
    //@ts-ignore
    req.userId = userId;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({success: false, message: responseMessages.invalidJwt });
  }
}
