import dbConnect from "@/helper/dbConnect"
import Order from "@/models/order";

export default async function (req, res) {
    dbConnect();

    if (req.method === 'POST') {
        try {
            let matchAndPayment = [];

            if (req.body.status === 0 || req.body.status === 1 || req.body.status === 2 || req.body.status === 3) {
                matchAndPayment = [
                    {
                        $match: {
                            status: req.body.status
                        }
                    },
                    {
                        $match: {
                            payment: 1
                        }
                    }
                ]
            } else if (req.body.status === 4) {
                matchAndPayment = [
                    {
                        $match: {
                            status: req.body.status
                        }
                    },
                    {
                        $match: {
                            payment: 0
                        }
                    }
                ]
            } else if (req.body.status === 5) {
                matchAndPayment = [
                    {
                        $match: {
                            payment: 2
                        }
                    }
                ]
            }

            const response = await Order.aggregate([
                ...matchAndPayment,
                {
                    $unwind: "$products"
                },
                {
                    $lookup:
                    {
                        from: "products",
                        localField: "products.productId",
                        foreignField: "_id",
                        as: "orderInfo"
                    }
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userInfo"
                    }
                },
                {
                    $unwind: "$orderInfo"
                },
                {
                    $unwind: "$userInfo"
                },
                {
                    $sort: {
                        createdOn: -1
                    }
                },
                {
                    $project: {
                        _id: 0,
                        products: {
                            quantity: 1,
                            price: 1
                        },
                        orderId: 1,
                        status: 1,
                        country: 1,
                        state: 1,
                        city: 1,
                        address: 1,
                        pincode: 1,
                        createdOn: 1,
                        orderInfo: {
                            name: 1,
                            images: 1,
                            company: 1,
                            category: 1,
                            preferences: 1,
                            origin: 1,
                        },
                        userInfo: {
                            firstName: 1,
                            lastName: 1,
                            email: 1
                        }
                    }
                }
            ])

            const orders = Array.from(response.reduce((map, obj) => {
                const { orderId } = obj;

                if (!map.has(orderId)) {
                    map.set(orderId, []);
                }

                map.get(orderId).push(obj);

                return map;
            }, new Map()));

            return res.status(200).json({
                data: orders,
                message: "Get ordered order successfully.",
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