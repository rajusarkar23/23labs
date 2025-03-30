import { Request } from "express";
import { db } from "../lib/db";
import { member } from "../lib/db/schema";
import { generateOtp, responseMessages } from "../config";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

// member signup
const signup = async (req: Request, res: any) => {
  const { name, email, password } = req.body;
  // checks
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res
      .status(400)
      .json({ success: false, message: responseMessages.invalidInput });
  }
  // hash password
  const hashedPassword = bcrypt.hashSync(password, 10);
  // otp generator
  const otp = generateOtp(6);
  console.log(otp);

  // hash otp
  const hashedOtp = bcrypt.hashSync(otp, 10);
  // db query
  try {
    // check if already exists
    const dbValidator = await db
      .select()
      .from(member)
      .where(eq(member.email, email));
    if (dbValidator.length !== 0) {
      return res
        .status(400)
        .json({ success: false, message: responseMessages.emailAlreadyExists });
    }
    // create if not exists
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

    const jwt_token = jwt.sign(
      { userId: createMember[0].id },
      `${process.env.JWT_SECRET}`
    );

    return res
      .cookie("_fit_life_gym_verify", jwt_token, {
        httpOnly: true,
        secure: true,
        maxAge: 10 * 60 * 1000,
      })
      .status(201)
      .json({
        success: true,
        message: responseMessages.signupSuccess,
        member: createMember,
        token: jwt_token,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: responseMessages.serverError });
  }
};

// member otp verify
const verifyOtp = async (req: Request, res: any) => {
  //@ts-ignore
  const user = req.userId;

  const { otp } = req.body;

  if (typeof user !== "number") {
    return res
      .status(401)
      .json({ success: false, message: responseMessages.notAuthorized });
  }

  try {
    const getUser = await db
      .select({ otp: member.otp, id: member.id })
      .from(member)
      .where(eq(member.id, user));
    const dbOTP = getUser[0].otp;

    // decode otp
    const compare = await bcrypt.compare(otp, dbOTP);

    if (compare) {
      await db
        .update(member)
        .set({
          isAccountVerified: true,
        })
        .where(eq(member.id, user));

      const jwt_token = jwt.sign(
        { userId: getUser[0].id },
        `${process.env.JWT_SECRET}`
      );

      return res
        .cookie("_fit_life_gym_auth", jwt_token, {
          httpOnly: true,
          secure: true,
          maxAge: 10 * 60 * 1000,
        })
        .status(200)
        .json({ success: true, message: responseMessages.signin });
    }

    return res
      .status(401)
      .json({ success: false, message: responseMessages.invalidInput });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: responseMessages.serverError });
  }
};

// member signin
const signin = async (req: Request, res: any) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    return res
      .status(401)
      .json({ success: false, message: responseMessages.invalidInput });
  }

  try {
    const getDbUser = await db
      .select({
        id: member.id,
        email: member.email,
        password: member.password,
      })
      .from(member)
      .where(eq(member.email, email));

    if (getDbUser.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: responseMessages.notFound });
    }

    const dbPassword = getDbUser[0].password;

    const compare = await bcrypt.compare(password, dbPassword)
    if (!compare) {
      return res.status(401).json({success: false, message: responseMessages.notAuthorized})
    }

    const jwt_token = jwt.sign({userId: getDbUser[0].id}, `${process.env.JWT_SECRET}`)
    return res.cookie("_fit_life_gym_auth", jwt_token, {
      httpOnly: true,
      secure: true,
      maxAge: 10 * 60 * 100
    }).status(200).json({success: true, message: responseMessages.signin})
  } catch (error) {
    console.log(error);
    return res.status(500).json({success: false, message: responseMessages.serverError})
  }
};

export { signup, verifyOtp, signin };
