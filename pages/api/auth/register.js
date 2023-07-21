import dbConnect from "@/helper/dbConnect"
import User from "@/models/user"
import bcrypt from "bcrypt"
import { checkConfirmPassword, checkEmail, checkPassword, checkAvatar, checkText } from "@/utils/validator"

export default async function (req, res) {
    await dbConnect()

    if (req.method === "POST") {
        try {
            const firstName = checkText('', req.body.firstName, 3, 20, true)
            const lastName = checkText('', req.body.lastName, 3, 20, true)
            const email = checkEmail(req.body.email)
            const password = checkPassword(req.body.password, true)
            const confirmPassword = checkConfirmPassword(req.body.password, req.body.confirmPassword)
            const avatar = checkAvatar('', req.body.avatar)

            if (firstName.error || lastName.error || email.error || password.error || confirmPassword.error || avatar.error) {
                return res.status(400).json({
                    message: "All fields are required. First name and Last name is required. It should be between 2 to 20 letters without spaces. Email should be unique. Password should be firm and make sure to confirm password should be matched with password. Avatar is also required.",
                    success: false
                })
            }

            const userExists = await User.exists({ email: req.body.email })

            if (userExists) {
                return res.status(409).json({
                    message: "Email already exists.",
                    success: false
                })
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10)

            const newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.avatar,
                createdOn: Date.now(),
                updatedOn: Date.now()
            })

            await newUser.save()

            return res.status(200).json({
                message: "Your account has been created.",
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
}