import Stripe from "stripe";
import Order from "@/models/order";

export default async function (req, res) {
    if (req.method === 'POST') {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const response = await Order.findOne({ orderId: req.body.orderId });

        const refund = await stripe.refunds.create({
            payment_intent: response.paymentIntentId,
        });

        await Order.findByIdAndUpdate({ _id: response._id }, { payment: 2 });

        return res.status(303).json({
            data: refund,
            message: "Payment refund successfully created.",
            success: true
        })
    }

    return res.status(405).json({
        message: "Method not allowed.",
        success: false
    })
}