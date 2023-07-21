import dbConnect from "@/helper/dbConnect"
import Order from "@/models/order"
import { withSessionRoute } from "@/helper/ironsession"
import mongoose from "mongoose"

export default withSessionRoute(async function (req, res) {
    await dbConnect()

    if (req.method == "GET") {
        try {
            try {
                const response = await Order.aggregate([
                    {
                        $match: {
                            userId: new mongoose.Types.ObjectId(req.session.user.id)
                        }
                    },
                    {
                        $match: {
                            status: { $ne: 4 }
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
                        $unwind: "$userInfo"
                    },
                    {
                        $unwind: "$orderInfo"
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
                            userInfo: {
                                firstName: 1,
                                lastName: 1,
                                email: 1
                            },
                            orderId: 1,
                            status: 1,
                            country: 1,
                            state: 1,
                            payment: 1,
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
                    success: true,
                    message: "Orders details get successfully."
                })
            } catch (error) {
                return res.status(401).json({
                    message: "Unvalid token.",
                    success: false
                })
            }
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
})