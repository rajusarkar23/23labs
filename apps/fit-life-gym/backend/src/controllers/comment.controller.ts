import { Request } from "express";
import { db } from "../lib/db";
import { commentSchema } from "../lib/db/schema";

const addComment = async (req: Request, res: any) => {
  const { comment, userName, commentFor } = req.body;
  //@ts-ignore
  const user = req.userId;

  if (typeof user !== "number") {
    return res.status(400).json({
        success: false,
        message: "Invalid Id, login again"
    })
  }

  try {
    const createComment = await db.insert(commentSchema).values({
        comment,
        commentByName: userName,
        commentByUserIdId: user,
        commentFor,
    }).returning()

    if (createComment.length === 0 )  {
            return res.status(400).json({
                success: false,
                message: "Not able to post the comment try again later"
            })
    }

    return res.status(201).json({
        success: true,
        message: "Comment created Successfully"
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "Internal server error, please try again later."
    })
  }
};


export {addComment}
