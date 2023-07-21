import dbConnect from "@/helper/dbConnect"
import User from "@/models/user"
import bcrypt from "bcrypt"
import { withSessionRoute } from "@/helper/ironsession"
import { checkConfirmPassword, checkPassword } from "@/utils/validator"

export default withSessionRoute(async function (req, res) {
    await dbConnect()

    if (req.method === 'PUT') {
        try {
            try {
                const oldPassword = checkPassword(req.body.oldPassword, true)
                const newPassword = checkPassword(req.body.newPassword, true)
                const confirmPassword = checkConfirmPassword(req.body.newPassword, req.body.confirmPassword)

                if (oldPassword.error || newPassword.error || confirmPassword.error) {
                    return res.status(400).json({
                        message: "All field are required. To change the password time you would have to give the same password as your old password and a new one would have to be strong. Confirm password will be matched with a new password.",
                        success: false
                    })
                }

                const user = await User.findOne({ _id: req.session.delivery.id });

                if (!user) {
                    return res.status(401).json({
                        message: "User does not exist.",
                        success: false
                    });
                }

                const match = await bcrypt.compare(req.body.oldPassword, user.password);

                if (!match) {
                    return res.status(401).json({
                        message: "Old password does not match.",
                        success: false
                    });
                }

                const hashedPassword = await bcrypt.hash(req.body.newPassword, 10)

                await User.findByIdAndUpdate({ _id: req.session.delivery.id }, {
                    password: hashedPassword
                });

                return res.status(200).json({
                    message: "Password changed succesfully.",
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