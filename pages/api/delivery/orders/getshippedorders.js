import dbConnect from "@/helper/dbConnect"
import Order from "@/models/order";
import User from "@/models/user";
import { checkEmail } from "@/utils/validator";

export default async function (req, res) {
    dbConnect();

    if (req.method === 'POST') {
        try {
            const email = checkEmail(req.body.email)

            if (email.error) {
                return res.status(400).json({
                    message: "Email is not valid.",
                    success: false
                })
            }

            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                return res.status(401).json({
                    message: "User does not exist.",
                    success: false
                });
            }

            const response = await Order.aggregate([
                {
                    $match: {
                        userId: user._id,
                        status: 2,
                        payment: 1
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
                            lastName: 1
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