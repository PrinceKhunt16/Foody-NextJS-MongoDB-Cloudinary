import dbConnect from "@/helper/dbConnect"
import Order from "@/models/order";

export default async function (req, res) {
    dbConnect();

    if (req.method === 'PATCH') {
        try {
            await Order.findOneAndUpdate({ orderId: req.body.orderId }, { status: req.body.status })

            return res.status(200).json({
                message: "Your order has not been accepted because you have not paid.",
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