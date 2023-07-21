import { notifySuccess } from "@/utils/notify";
import { useRouter } from "next/router"
import { useEffect } from "react";
import Stripe from "stripe";

export default function PaymentSuccess() {
    const router = useRouter()
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const getPaymentIntent = async () => {
        if (router.query.session_id && router.query.order_id) {
            try {
                const paymentIntentResponse = await stripe.checkout.sessions.retrieve(router.query.session_id);

                const paymentResponse = await fetch(`${process.env.API_BASE_URL}/order/changepaymentstatus`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        orderId: router.query.order_id,
                        paymentIntentId: paymentIntentResponse.payment_intent,
                        payment: 1
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    }
                })

                const paymentData = await paymentResponse.json();

                if (paymentData.success) {
                    notifySuccess(paymentData.message)
                    router.push('/order')
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        getPaymentIntent();
    }, [router.query]);

    return (
        <>
        </>
    )
}