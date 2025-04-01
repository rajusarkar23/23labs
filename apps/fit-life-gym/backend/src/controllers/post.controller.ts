import { Request } from "express";
import { db } from "../lib/db";
import { post } from "../lib/db/schema";

const create = async (req: Request, res: any) => {
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
    const create = await db
      .insert(post)
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
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export { create };
