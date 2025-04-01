import { Router } from "express";
import multer from "multer"
import { userAuthSession } from "../lib/middlewares";
import { create, uploadFile,  } from "../controllers/post.controller";

const router = Router()
// using memory storage to get buffer
const memoryStorage = multer.memoryStorage()
// set storage to memory storage
const upload = multer({storage:memoryStorage})

router.post("/member/post/create", userAuthSession, create)
router.post("/member/post/upload-post-image",upload.single("file"), uploadFile)

export default router;