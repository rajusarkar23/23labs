import { Request } from "express";
import { db } from "../lib/db";
import { member } from "../lib/db/schema";
import { generateOtp, responseMessages } from "../config";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

// member signup
const signup = async (req: Request, res: any) => {
  const { signupData } = req.body;

  // checks
  if (
    typeof signupData.data.name !== "string" ||
    typeof signupData.data.email !== "string" ||
    typeof signupData.data.password !== "string"
  ) {
    return res
      .status(400)
      .json({ success: false, message: responseMessages.invalidInput });
  }
  // hash password
  const hashedPassword = bcrypt.hashSync(signupData.data.password, 10);
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
      .where(eq(member.email, signupData.data.email));
    if (dbValidator.length !== 0) {
      return res
        .status(400)
        .json({ success: false, message: responseMessages.emailAlreadyExists });
    }
    // create if not exists
    const createMember = await db
      .insert(member)
      .values({
        email: signupData.data.email,
        name: signupData.data.name,
        userName: signupData.data.email,
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
        maxAge: 10 * 60 * 1000,
        sameSite: true,
        secure: true,
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
      .json({ success: false, message: responseMessages.invalidInput });
  }

  try {
    const getUser = await db
      .select({ otp: member.otp, id: member.id, username: member.userName })
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
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          success: true,
          message: responseMessages.signin,
          username: getUser[0].username,
        });
    }

    return res
      .status(401)
      .json({ success: false, message: responseMessages.invalidOtp });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: responseMessages.serverError });
  }
};

// member signin
const signin = async (req: Request, res: any) => {
  const { signinData } = req.body;

  if (
    typeof signinData.data.email !== "string" ||
    typeof signinData.data.password !== "string"
  ) {
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
        isVerified: member.isAccountVerified,
        username: member.userName,
      })
      .from(member)
      .where(eq(member.email, signinData.data.email));

    if (getDbUser.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: responseMessages.notFound });
    }

    if (!getDbUser[0].isVerified) {
      return res
        .status(401)
        .json({ success: false, message: "This account is not verified." });
    }

    const dbPassword = getDbUser[0].password;

    const compare = await bcrypt.compare(signinData.data.password, dbPassword);
    if (!compare) {
      return res
        .status(401)
        .json({ success: false, message: responseMessages.notAuthorized });
    }

    const jwt_token = jwt.sign(
      { userId: getDbUser[0].id },
      `${process.env.JWT_SECRET}`
    );
    return res
      .cookie("_fit_life_gym_auth", jwt_token, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: responseMessages.signin,
        username: getDbUser[0].username,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: responseMessages.serverError });
  }
};

// get profile details
const getProfileDetails = async (req: Request, res: any) => {
  const userName = req.query;
  //@ts-ignore
  const user = req.userId;

  if (typeof userName.userName !== "string" || typeof user !== "number") {
    return res.status(400).json({
      success: false,
      message: "User verification failed, login again",
    });
  }

  try {
    const getUser = await db
      .select({
        imageUrl: member.profileImage,
        name: member.name,
        userName: member.userName,
        dob: member.dob,
        gender: member.gender,
        profession: member.profession,
      })
      .from(member)
      .where(eq(member.id, user));

    if (getUser.length === 0 || userName.userName !== getUser[0].userName) {
      return res
        .status(401)
        .json({ success: false, message: "No member found." });
    }


    return res.status(201).json({success: true, message :"member fetched", memberProfile: getUser})
  } catch (error) {
    console.log(error);
    return res.status(500).json({success: false, message: responseMessages.serverError})
    
  }
};

// update username
const updateUserName = async (req: Request, res: any) => {
  //@ts-ignore
  const user = req.userId
  const {newUserName} = req.body

  if (typeof user !== "number" || typeof newUserName !== "string") {
    return res.status(400).json({success: false, message: "Information is not sufficient or incorrect to procced with this request."})
  }

  try {
    const getDbUser = await db.update(member).set({
      userName: newUserName
    }).where(eq(member.id, user)).returning({username: member.userName})

    if (getDbUser.length === 0) {
      return res.status(400).json({success: false, message: "Unable to update your username"})
    }

    return res.status(201).json({success: true, message: "Username updated successfully", username: getDbUser[0].username})
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({success: false, message: responseMessages.serverError})
  }
}

// update name
const updateName = async (req: Request, res: any) => {
  //@ts-ignore
  const user = req.userId
  const {newName} = req.body

  if (typeof user !== "number" || typeof newName !== "string") {
    return res.status(400).json({success: false, message: "Information is not sufficient or incorrect to procced with this request."})
  }

  try {
    const getDbUser = await db.update(member).set({
      name: newName
    }).where(eq(member.id, user)).returning({
      imageUrl: member.profileImage,
      userName: member.userName, 
      name: member.name, 
      gender: member.gender,
      profession: member.profession,
      dob: member.dob
    })

    if (getDbUser.length === 0) {
      return res.status(400).json({success: false, message: "Unable to update your name"})
    }

    return res.status(201).json({success: true, message: "Name updated successfully", memberProfile: getDbUser[0]})
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({success: false, message: responseMessages.serverError})
  }
}

export { signup, verifyOtp, signin, getProfileDetails, updateUserName, updateName };
