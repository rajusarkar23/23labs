"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
const db_1 = require("../lib/db");
const schema_1 = require("../lib/db/schema");
const config_1 = require("../config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const drizzle_orm_1 = require("drizzle-orm");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string") {
        return res
            .status(400)
            .json({ success: false, message: config_1.responseMessages.invalidInput });
    }
    const hashedPassword = bcrypt_1.default.hashSync(password, 10);
    const otp = (0, config_1.generateOtp)(6);
    const hashedOtp = bcrypt_1.default.hashSync(otp, 10);
    try {
        const dbValidator = yield db_1.db
            .select()
            .from(schema_1.member)
            .where((0, drizzle_orm_1.eq)(schema_1.member.email, email));
        if (dbValidator.length !== 0) {
            return res
                .status(400)
                .json({ success: false, message: config_1.responseMessages.emailAlreadyExists });
        }
        const createMember = yield db_1.db
            .insert(schema_1.member)
            .values({
            email,
            name,
            userName: email,
            password: hashedPassword,
            otp: hashedOtp,
        })
            .returning({ id: schema_1.member.id });
        return res
            .status(201)
            .json({
            success: true,
            message: config_1.responseMessages.signupSuccess,
            member: createMember,
        });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: config_1.responseMessages.serverError });
    }
});
exports.signup = signup;
