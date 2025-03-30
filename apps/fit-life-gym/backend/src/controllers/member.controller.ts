import { Request } from "express";
import { db } from "../lib/db";
import { member } from "../lib/db/schema";
import { generateOtp, responseMessages } from "../config";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

const signup = async (req: Request, res: any) => {
  const { name, email, password } = req.body;
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res
      .status(400)
      .json({ success: false, message: responseMessages.invalidInput });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const otp = generateOtp(6);

  const hashedOtp = bcrypt.hashSync(otp, 10);

  try {
    const dbValidator = await db
      .select()
      .from(member)
      .where(eq(member.email, email));
    if (dbValidator.length !== 0) {
      return res
        .status(400)
        .json({ success: false, message: responseMessages.emailAlreadyExists });
    }
    const createMember = await db
      .insert(member)
      .values({
        email,
        name,
        userName: email,
        password: hashedPassword,
        otp: hashedOtp,
      })
      .returning({ id: member.id });

    return res
      .status(201)
      .json({
        success: true,
        message: responseMessages.signupSuccess,
        member: createMember,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: responseMessages.serverError });
  }
};

export { signup };
