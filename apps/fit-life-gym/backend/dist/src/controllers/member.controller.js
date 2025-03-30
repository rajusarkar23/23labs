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
exports.signin = exports.verifyOtp = exports.signup = void 0;
const db_1 = require("../lib/db");
const schema_1 = require("../lib/db/schema");
const config_1 = require("../config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const drizzle_orm_1 = require("drizzle-orm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// member signup
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    // checks
    if (typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string") {
        return res
            .status(400)
            .json({ success: false, message: config_1.responseMessages.invalidInput });
    }
    // hash password
    const hashedPassword = bcrypt_1.default.hashSync(password, 10);
    // otp generator
    const otp = (0, config_1.generateOtp)(6);
    console.log(otp);
    // hash otp
    const hashedOtp = bcrypt_1.default.hashSync(otp, 10);
    // db query
    try {
        // check if already exists
        const dbValidator = yield db_1.db
            .select()
            .from(schema_1.member)
            .where((0, drizzle_orm_1.eq)(schema_1.member.email, email));
        if (dbValidator.length !== 0) {
            return res
                .status(400)
                .json({ success: false, message: config_1.responseMessages.emailAlreadyExists });
        }
        // create if not exists
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
        const jwt_token = jsonwebtoken_1.default.sign({ userId: createMember[0].id }, `${process.env.JWT_SECRET}`);
        return res
            .cookie("_fit_life_gym_verify", jwt_token, {
            httpOnly: true,
            secure: true,
            maxAge: 10 * 60 * 1000,
        })
            .status(201)
            .json({
            success: true,
            message: config_1.responseMessages.signupSuccess,
            member: createMember,
            token: jwt_token,
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
// member otp verify
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const user = req.userId;
    const { otp } = req.body;
    if (typeof user !== "number") {
        return res
            .status(401)
            .json({ success: false, message: config_1.responseMessages.notAuthorized });
    }
    try {
        const getUser = yield db_1.db
            .select({ otp: schema_1.member.otp, id: schema_1.member.id })
            .from(schema_1.member)
            .where((0, drizzle_orm_1.eq)(schema_1.member.id, user));
        const dbOTP = getUser[0].otp;
        // decode otp
        const compare = yield bcrypt_1.default.compare(otp, dbOTP);
        if (compare) {
            yield db_1.db
                .update(schema_1.member)
                .set({
                isAccountVerified: true,
            })
                .where((0, drizzle_orm_1.eq)(schema_1.member.id, user));
            const jwt_token = jsonwebtoken_1.default.sign({ userId: getUser[0].id }, `${process.env.JWT_SECRET}`);
            return res
                .cookie("_fit_life_gym_auth", jwt_token, {
                httpOnly: true,
                secure: true,
                maxAge: 10 * 60 * 1000,
            })
                .status(200)
                .json({ success: true, message: config_1.responseMessages.signin });
        }
        return res
            .status(401)
            .json({ success: false, message: config_1.responseMessages.invalidInput });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: config_1.responseMessages.serverError });
    }
});
exports.verifyOtp = verifyOtp;
// member signin
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
        return res
            .status(401)
            .json({ success: false, message: config_1.responseMessages.invalidInput });
    }
    try {
        const getDbUser = yield db_1.db
            .select({
            id: schema_1.member.id,
            email: schema_1.member.email,
            password: schema_1.member.password,
        })
            .from(schema_1.member)
            .where((0, drizzle_orm_1.eq)(schema_1.member.email, email));
        if (getDbUser.length === 0) {
            return res
                .status(401)
                .json({ success: false, message: config_1.responseMessages.notFound });
        }
        const dbPassword = getDbUser[0].password;
        const compare = yield bcrypt_1.default.compare(password, dbPassword);
        if (!compare) {
            return res.status(401).json({ success: false, message: config_1.responseMessages.notAuthorized });
        }
        const jwt_token = jsonwebtoken_1.default.sign({ userId: getDbUser[0].id }, `${process.env.JWT_SECRET}`);
        return res.cookie("_fit_life_gym_auth", jwt_token, {
            httpOnly: true,
            secure: true,
            maxAge: 10 * 60 * 100
        }).status(200).json({ success: true, message: config_1.responseMessages.signin });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: config_1.responseMessages.serverError });
    }
});
exports.signin = signin;
