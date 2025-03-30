"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = exports.responseMessages = void 0;
exports.responseMessages = {
    signin: "Login success",
    signupSuccess: "Signup success",
    serverError: "Internal server error, try again",
    invalidInput: "Inputs are not accurate",
    notFound: "Nothing found with the provided inputs",
    notAuthorized: "Unauthorized, check credentials, login again",
    emailAlreadyExists: "This email already exists"
};
const generateOtp = (otpLength) => {
    let otp = "";
    for (let i = 0; i < otpLength; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
};
exports.generateOtp = generateOtp;
