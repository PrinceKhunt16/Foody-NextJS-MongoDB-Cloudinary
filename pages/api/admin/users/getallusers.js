import dbConnect from "@/helper/dbConnect";
import User from "@/models/user";
import { encryptObjectId } from "@/utils/objectId";

export default async function handler(req, res) {
    await dbConnect()

    if (req.method === "POST") {
        const response = await User.find({
            $or: [
                { type: 0 },
                { type: 2 }
            ],
        }).skip(req.body.page * req.body.documents).limit(req.body.documents);
        const pages = Math.ceil(await User.count() / req.body.documents);
        const data = [];

        response.forEach((user) => {
            data.push({
                id: encryptObjectId(user.id),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.avatar,
                status: user.status.toString(),
                type: user.type.toString(),
                createdOn: user.createdOn.toString()
            })
        });

        return res.status(200).json({
            data: data,
            pages: pages,
            message: "All products.",
            success: true
        })
    }

    return res.status(405).json({
        message: "Method not allowed.",
        success: false
    })
}