import dbConnect from "@/helper/dbConnect"
import Order from "@/models/order";

export default async function (req, res) {
    dbConnect();

    if (req.method === 'PATCH') {
        try {
            await Order.findOneAndUpdate({ orderId: req.body.orderId }, { payment: req.body.payment, paymentIntentId: req.body.paymentIntentId })

            return res.status(200).json({
                message: "Order status change successfully.",
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