import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const member = pgTable("members",{
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    email: text().notNull(),
    password: text().notNull(),
    profileImage: text().notNull().default("habibi.jpg")
})