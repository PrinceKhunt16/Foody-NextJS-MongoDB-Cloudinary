import dbConnect from "@/helper/dbConnect"
import Order from "@/models/order"
import bcrypt from "bcrypt"

export default async function (req, res) {
    dbConnect();

    if (req.method === 'PATCH') {
        try {
            const response = await Order.findOne({ orderId: req.body.orderId })
            const nowtimestamp = Date.now()

            const match = await bcrypt.compare(req.body.otp, response.otp)

            const maxtimestamp = response.otptimestamp + 1500000

            if (match) {
                if (nowtimestamp <= maxtimestamp) {
                    await Order.findOneAndUpdate({ orderId: req.body.orderId }, {
                        status: 3,
                        $unset: {
                            otp: response.otp,
                            otptimestamp: response.otptimestamp
                        }
                    })

                    return res.status(200).json({
                        message: "Order delivered successfully.",
                        success: true
                    })
                } else {
                    await Order.findOneAndUpdate({ orderId: req.body.orderId }, {
                        $unset: {
                            otp: response.otp,
                            otptimestamp: response.otptimestamp
                        }
                    })

                    return res.status(401).json({
                        message: "Your OTP time limit exceeded.",
                        success: false
                    })
                }
            } else {
                return res.status(401).json({
                    message: "You entered an invalid OTP.",
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
}