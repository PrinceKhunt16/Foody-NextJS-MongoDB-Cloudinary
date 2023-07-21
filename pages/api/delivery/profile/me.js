import dbConnect from "@/helper/dbConnect"
import User from "@/models/user"
import { withSessionRoute } from "@/helper/ironsession"
import { checkText } from "@/utils/validator"

export default withSessionRoute(async function (req, res) {
    await dbConnect()

    if (req.method == "GET") {
        try {
            try {
                const user = await User.findOne({ _id: req.session.delivery.id }).select('-_id -password -createdOn -updatedOn -status -type')

                if (!user) {
                    return res.status(404).json({
                        message: "User not found.",
                        success: false
                    })
                }

                return res.status(200).json({
                    data: user,
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
    } else if (req.method === 'PUT') {
        try {
            try {
                const firstName = checkText('', req.body.firstName, 2, 20, true)
                const lastName = checkText('', req.body.lastName, 2, 20, true)

                if (firstName.error || lastName.error) {
                    return res.status(400).json({
                        message: "All field are required. First name and Last name is required. It should be between 2 to 20 letters without spaces.",
                        success: false
                    })
                }

                const user = await User.findByIdAndUpdate({ _id: req.session.delivery.id }, {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                });

                if (!user) {
                    return res.status(404).json({
                        message: "User not found.",
                        success: false
                    });
                }

                return res.status(200).json({
                    message: "Details updated successfully.",
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