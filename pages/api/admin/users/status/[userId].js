import dbConnect from "@/helper/dbConnect";
import User from "@/models/user";
import { decryptObjectId } from "@/utils/objectId";

export default async function handler(req, res) {
    await dbConnect()

    if (req.method === "POST") {
        await User.findByIdAndUpdate({ _id: decryptObjectId(req.query.userId) }, { status: req.body.status === "1" ? 0 : 1 })

        return res.status(200).json({
            message: "User status changed successfully.",
            success: true
        })
    }

    return res.status(405).json({
        message: "Method not allowed.",
        success: false
    })
}