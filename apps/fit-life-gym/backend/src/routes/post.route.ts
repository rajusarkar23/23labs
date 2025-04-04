import { Router } from "express";
import multer from "multer"
import { userAuthSession } from "../lib/middlewares";
import { create, fetchHomePosts, fetchPosts, uploadFile,  } from "../controllers/post.controller";
import { addLike } from "../controllers/like.controller";

const router = Router()
// using memory storage to get buffer
const memoryStorage = multer.memoryStorage()
// set storage to memory storage
const upload = multer({storage:memoryStorage})

router.post("/member/post/create", userAuthSession, create)
router.post("/member/post/upload-post-image",upload.single("file"), uploadFile)
router.get("/member/post/get-posts", userAuthSession, fetchPosts)
router.post("/member/post/like/add", userAuthSession, addLike)
router.get("/member/post/get-home-posts", userAuthSession, fetchHomePosts)

export default router;