import dbConnect from "@/helper/dbConnect"
import User from "@/models/user"
import bcrypt from "bcrypt"
import { withSessionRoute } from "@/helper/ironsession"
import { checkEmail, checkPassword } from "@/utils/validator"

export default withSessionRoute(async function (req, res) {
    await dbConnect();

    if (req.method === "POST") {
        try {
            const email = checkEmail(req.body.email)
            const password = checkPassword(req.body.password, false)

            if (email.error || password.error) {
                return res.status(400).json({
                    message: "All field are required. You will have to give that email which is registered. According to the email it password should be.",
                    success: false
                })
            }

            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                return res.status(401).json({
                    message: "User does not exist.",
                    success: false
                });
            }

            const match = await bcrypt.compare(req.body.password, user.password);

            if (!match) {
                return res.status(401).json({
                    message: "Unvalid user credentials.",
                    success: false
                });
            }

            if (Number(user.type.toString())) {
                return res.status(401).json({
                    message: "Unvalid user credentials.",
                    success: false
                });
            }

            if (Number(user.status.toString()) === 0) {
                return res.status(401).json({
                    message: "Your account has been blocked.",
                    success: false
                });
            }

            req.session.user = {
                id: user._id
            }

            await req.session.save();

            return res.status(200).json({
                message: "You logged in successfully.",
                success: true
            })
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