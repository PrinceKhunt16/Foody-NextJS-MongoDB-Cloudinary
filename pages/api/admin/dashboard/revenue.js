import dbConnect from "@/helper/dbConnect";
import Order from "@/models/order";

export default async function (req, res) {
    dbConnect();

    if (req.method === "GET") {
        try {
            let totals = {
                ordered: 0,
                accepted: 0,
                shipped: 0,
                delivered: 0,
                estimated: 0
            };

            const response = await Order.aggregate([
                {
                    $match: {
                        payment: 1
                    }
                },
                {
                    $project: {
                        products: {
                            quantity: 1,
                            price: 1
                        },
                        status: 1
                    }
                }
            ])

            response.forEach((item) => {
                item.products.forEach((product) => {
                    switch (item.status) {
                        case 0:
                            totals = {
                                ...totals,
                                ordered: totals.ordered += (product.quantity * product.price)
                            }
                            break;
                        case 1:
                            totals = {
                                ...totals,
                                accepted: totals.accepted += (product.quantity * product.price)
                            }
                            break;
                        case 2:
                            totals = {
                                ...totals,
                                shipped: totals.shipped += (product.quantity * product.price)
                            }
                            break;
                        case 3:
                            totals = {
                                ...totals,
                                delivered: totals.delivered += (product.quantity * product.price)
                            }
                            break;
                    }

                    totals = {
                        ...totals,
                        estimated: totals.estimated += (product.quantity * product.price)
                    }
                })
            })

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