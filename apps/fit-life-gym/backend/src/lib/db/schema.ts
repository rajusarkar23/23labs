import { boolean, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { profileImage } from "../../config";

export const genderEnum = pgEnum("gender", ["male", "female"])

// members table
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
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date())
})

// posts table
export const post = pgTable("posts", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    textContent: text("text_content").notNull(),
    postImageUrl: text("post_image_url"),
    postBelongTo: integer("post_belong_to")
      .notNull()
      .references(() => member.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at  ")
      .notNull()
      .$onUpdate(() => new Date()),
  });
  