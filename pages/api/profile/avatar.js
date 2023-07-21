import dbConnect from "@/helper/dbConnect"
import User from "@/models/user"
import { withSessionRoute } from "@/helper/ironsession"
import { checkAvatar } from "@/utils/validator"

export default withSessionRoute(async function (req, res) {
    await dbConnect()

    if (req.method === 'PUT') {
        try {
            try {
                const avatar = checkAvatar('', req.body.avatar)

                if (avatar.error) {
                    return res.status(400).json({
                        message: "All field are required.",
                        success: false
                    })
                }

                const user = await User.findByIdAndUpdate({ _id: req.session.user.id }, {
                    avatar: req.body.avatar
                });

                if (!user) {
                    return res.status(404).json({
                        message: "User not found.",
                        success: false
                    });
                }

                return res.status(200).json({
                    message: "Avatar changed successfully.",
                    success: true
                })
            } catch (error) {
                return res.status(401).json({
                    message: "Unvalid token.",
                    success: false
                })
            }
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error.",
                err: error,
                success: false
            })
        }
    }

    return res.status(405).json({
        message: "Method not allowed.",
        success: false
    })
})