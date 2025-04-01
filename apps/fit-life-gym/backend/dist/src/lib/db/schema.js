"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.member = exports.genderEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const config_1 = require("../../config");
exports.genderEnum = (0, pg_core_1.pgEnum)("gender", ["male", "female"]);
exports.member = (0, pg_core_1.pgTable)("members", {
    id: (0, pg_core_1.integer)("id").primaryKey().generatedAlwaysAsIdentity(),
    name: (0, pg_core_1.text)("name").notNull(),
    userName: (0, pg_core_1.text)("user_name").notNull(),
    email: (0, pg_core_1.text)("email").notNull(),
    password: (0, pg_core_1.text)("password").notNull(),
    otp: (0, pg_core_1.text)("otp").notNull(),
    isAccountVerified: (0, pg_core_1.boolean)("is_account_verified").default(false),
    profileImage: (0, pg_core_1.text)("profile_image").notNull().default(`${config_1.profileImage}`),
    profession: (0, pg_core_1.text)("profession"),
    gender: (0, exports.genderEnum)("gender"),
    dob: (0, pg_core_1.text)("dob"),
});
