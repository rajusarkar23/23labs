import { Request } from "express";
import { like } from "../lib/db/schema";
import { db } from "../lib/db";

// add like
const addLike = async (req: Request, res: any) => {
    //@ts-ignore
    const user = req.userId
    const {post} = req.body

    const postIdToNum = Number(post)
    


    
    // checks
    if (typeof user !== "number" || typeof postIdToNum !== "number") {
        return res.status(400).json({
            success: false,
            message: "Invalid input types."
        })
    }

    try {
        const add = await db.insert(like).values({
            likeBy: user,
            likeFor: postIdToNum,
        }).returning()

        if (add.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Unable to add like, try again"
            })
        }

        return res.status(200).json({success: true, message: "Success"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error, try again."
        })
    }
}

// remove like
// const removeLike = async (req: Request, res: any) => {
//     //@ts-ignore
//     const user = req.userId
//     const post = req.body
//     if (typeof user !== "number" || typeof post !== "number") {
//         return res.status(400).json({
//             success: false,
//             message: "Invalid input types."
//         })
//     }


//     try {
//         const remove = await db.delete(like).where(eq())
//     } catch (error) {
        
//     }

// }

export {addLike}