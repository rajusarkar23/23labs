import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";
import { profileImage } from "../../config";

export const member = pgTable("members",{
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    userName: text().notNull(),
    email: text().notNull(),
    password: text().notNull(),
    otp: text().notNull(),
    isAccountVerified: boolean().default(false),
    profileImage: text().notNull().default(`${profileImage}`)
})