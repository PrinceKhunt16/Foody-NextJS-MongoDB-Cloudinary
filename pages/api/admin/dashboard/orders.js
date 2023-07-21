import dbConnect from "@/helper/dbConnect";
import Order from "@/models/order";

function countStatusAndPaymentObjects(data, status, payment) {
    let count = 0;

    data.forEach(item => {
        if (item.status === status && item.payment === payment) {
            count++;
        }
    });

    return count;
}

function countPaymentObjects(data, status) {
    let count = 0;

    data.forEach(item => {
        if (item.payment === status) {
            count++;
        }
    });

    return count;
}

export default async function (req, res) {
    dbConnect();

    if (req.method === "GET") {
        try {
            let totals = {
                total: 0,
                ordered: 0,
                accepted: 0,
                shipped: 0,
                delivered: 0,
                canceled: 0,
                refunded: 0
            };

            const response = await Order.aggregate([
                {
                    $project: {
                        status: 1,
                        payment: 1
                    }
                }
            ])

            totals = {
                ...totals,
                total: response.length,
                ordered: countStatusAndPaymentObjects(response, 0, 1),
                accepted: countStatusAndPaymentObjects(response, 1, 1),
                shipped: countStatusAndPaymentObjects(response, 2, 1),
                delivered: countStatusAndPaymentObjects(response, 3, 1),
                canceled: countStatusAndPaymentObjects(response, 4, 0),
                refunded: countPaymentObjects(response, 2)
            }

            return res.status(200).json({
                data: totals,
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