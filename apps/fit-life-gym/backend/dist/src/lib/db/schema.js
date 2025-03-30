"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.member = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.member = (0, pg_core_1.pgTable)("members", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    name: (0, pg_core_1.text)().notNull(),
    userName: (0, pg_core_1.text)().notNull(),
    email: (0, pg_core_1.text)().notNull(),
    password: (0, pg_core_1.text)().notNull(),
    otp: (0, pg_core_1.text)().notNull(),
    profileImage: (0, pg_core_1.text)().notNull().default("habibi.jpg")
});
