"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.member = exports.genderEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const config_1 = require("../../config");
exports.genderEnum = (0, pg_core_1.pgEnum)("gender", ["male", "female"]);
exports.member = (0, pg_core_1.pgTable)("members", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    name: (0, pg_core_1.text)().notNull(),
    userName: (0, pg_core_1.text)().notNull(),
    email: (0, pg_core_1.text)().notNull(),
    password: (0, pg_core_1.text)().notNull(),
    otp: (0, pg_core_1.text)().notNull(),
    isAccountVerified: (0, pg_core_1.boolean)().default(false),
    profileImage: (0, pg_core_1.text)().notNull().default(`${config_1.profileImage}`),
    profession: (0, pg_core_1.text)(),
    gender: (0, exports.genderEnum)(),
    dob: (0, pg_core_1.text)(),
});
