import Stripe from "stripe";

export default async function (req, res) {
    if (req.method === 'POST') {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Payable amount.",
                        },
                        unit_amount: req.body.amount * 100,
                    },
                    quantity: 1
                }
            ],
            success_url: `${process.env.APP_BASE_URL}/paymentsuccess?session_id={CHECKOUT_SESSION_ID}&order_id=${req.body.orderId}`,
            cancel_url: `${process.env.APP_BASE_URL}/paymentcancel?order_id=${req.body.orderId}`,
        })

        return res.status(303).json({
            data: session,
            message: "Payment session successfully created.",
            success: true
        })
    }

    return res.status(405).json({
        message: "Method not allowed.",
        success: false
    })
}