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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addComment = void 0;
const db_1 = require("../lib/db");
const schema_1 = require("../lib/db/schema");
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment, userName, commentFor } = req.body;
    //@ts-ignore
    const user = req.userId;
    if (typeof user !== "number") {
        return res.status(400).json({
            success: false,
            message: "Invalid Id, login again"
        });
    }
    try {
        const createComment = yield db_1.db.insert(schema_1.commentSchema).values({
            comment,
            commentByName: userName,
            commentByUserIdId: user,
            commentFor,
        }).returning();
        if (createComment.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Not able to post the comment try again later"
            });
        }
        return res.status(201).json({
            success: true,
            message: "Comment created Successfully"
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error, please try again later."
        });
    }
});
exports.addComment = addComment;
