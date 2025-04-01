import { boolean, integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { profileImage } from "../../config";

export const genderEnum = pgEnum("gender", ["male", "female"])

export const member = pgTable("members",{
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: text("name").notNull(),
    userName: text("user_name").notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    otp: text("otp").notNull(),
    isAccountVerified: boolean("is_account_verified").default(false),
    profileImage: text("profile_image").notNull().default(`${profileImage}`),
    profession: text("profession"),
    gender: genderEnum("gender"),
    dob: text("dob"),
})