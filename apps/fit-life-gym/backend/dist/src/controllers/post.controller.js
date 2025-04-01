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
exports.create = void 0;
const db_1 = require("../lib/db");
const schema_1 = require("../lib/db/schema");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { textContent, imageUrl } = req.body;
    //@ts-ignore
    const user = req.userId;
    if (typeof user !== "number") {
        return res.status(400).json({
            success: false,
            message: "User id is not correct.",
        });
    }
    try {
        const create = yield db_1.db
            .insert(schema_1.post)
            .values({
            postBelongTo: user,
            textContent: textContent,
            postImageUrl: imageUrl,
        })
            .returning();
        if (create.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Unable to create your post, try again",
            });
        }
        return res.status(200).json({ success: true, message: "Post created" });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error." });
    }
});
exports.create = create;
