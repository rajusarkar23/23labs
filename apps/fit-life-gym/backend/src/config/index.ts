export const responseMessages = {
    signin: "Login success",
    signupSuccess: "Signup success",
    serverError: "Internal server error, try again",
    invalidInput: "Inputs are not accurate",
    notFound: "Nothing found with the provided inputs, make sure inputs are correct",
    notAuthorized: "Unauthorized, check credentials",
    invalidOtp: "Wrong OTP",
    emailAlreadyExists: "This email already exists is database",
    invalidJwt: "Invalid jwt login again"
}

export const generateOtp = (otpLength: number) => {
    let otp = ""
    for (let i = 0; i < otpLength; i++) {
        otp += Math.floor(Math.random() * 10)
    }
    return otp
}
