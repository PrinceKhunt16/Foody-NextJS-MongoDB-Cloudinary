import { notifyError } from "@/utils/notify";
import { useRouter } from "next/router"
import { useEffect } from "react";

export default function PaymentCancel() {
    const router = useRouter()

    const handlePaymentCancel = async () => {
        if (router.query.order_id) {
            try {
                const cancelPaymentResponse = await fetch(`${process.env.API_BASE_URL}/order/changeorderstatus`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        orderId: router.query.order_id,
                        status: 4
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    }
                })

                const cancelPaymentData = await cancelPaymentResponse.json()

                if (cancelPaymentData.success) {
                    notifyError(cancelPaymentData.message)
                    router.push('/cart')
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        handlePaymentCancel();
    }, [router.query]);

    return (
        <>
        </>
    )
}