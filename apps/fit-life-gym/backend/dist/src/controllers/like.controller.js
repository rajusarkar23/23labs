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
exports.addLike = void 0;
const schema_1 = require("../lib/db/schema");
const db_1 = require("../lib/db");
// add like
const addLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const user = req.userId;
    const { post } = req.body;
    const postIdToNum = Number(post);
    // checks
    if (typeof user !== "number" || typeof postIdToNum !== "number") {
        return res.status(400).json({
            success: false,
            message: "Invalid input types."
        });
    }
    try {
        const add = yield db_1.db.insert(schema_1.like).values({
            likeBy: user,
            likeFor: postIdToNum,
        }).returning();
        if (add.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Unable to add like, try again"
            });
        }
        return res.status(200).json({ success: true, message: "Success" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error, try again."
        });
    }
});
exports.addLike = addLike;
