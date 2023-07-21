import dbConnect from "@/helper/dbConnect"
import { transporter } from "@/helper/nodemailer"
import bcrypt from "bcrypt"
import Order from "@/models/order"

export default async function (req, res) {
    dbConnect();

    if (req.method === 'PATCH') {
        try {
            const OTP = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
            const otptimestamp = Date.now();
            const currentDate = new Date(Date.now());

            const hashedOTP = await bcrypt.hash(OTP, 10)

            const order = await Order.findOne({ orderId: req.body.orderId });

            if (order.status === 3) {
                return res.status(200).json({
                    message: `${req.body.orderId} order is already delivered.`,
                    success: true
                })
            }

            const response = await Order.findByIdAndUpdate({ _id: order._id }, { otp: hashedOTP, otptimestamp: otptimestamp })

            if (!response) {
                return res.status(404).json({
                    message: "This email does not exists.",
                    success: false
                })
            }

            await transporter.sendMail({
                from: process.env.SMPT_MAIL,
                to: req.body.email,
                subject: `Foody.com Order Confirmation OTP ${currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds() + " " + ((currentDate.getHours() >= 12) ? 'PM' : 'AM')}`,
                text: "Deliver happiness, unlock the joy with your verification OTP!",
                html: `<h1>${OTP}</h1>`
            })

            return res.status(200).json({
                message: "OTP send successfully.",
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