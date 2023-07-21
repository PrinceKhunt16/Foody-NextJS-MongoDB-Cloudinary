import dbConnect from "@/helper/dbConnect"
import User from "@/models/user"
import { withSessionRoute } from "@/helper/ironsession"
import mongoose from "mongoose"
import { encryptObjectId } from "@/utils/objectId"

export default withSessionRoute(async function (req, res) {
    await dbConnect()

    if (req.method == "GET") {
        try {
            try {
                const user = await User.aggregate([
                    {
                        $match: {
                            _id: new mongoose.Types.ObjectId(req.session.user.id)
                        }
                    },
                    {
                        $unwind: "$cart"
                    },
                    {
                        $lookup:
                        {
                            from: "products",
                            localField: "cart.productId",
                            foreignField: "_id",
                            as: "productInfo"
                        }
                    },
                    {
                        $unwind: "$productInfo"
                    },
                    {
                        $project: {
                            _id: 0,
                            cart: {
                                quantity: 1
                            },
                            productInfo: {
                                _id: 1,
                                name: 1,
                                images: 1,
                                price: 1,
                                weight: 1,
                                company: 1,
                                category: 1,
                                discount: 1
                            }
                        }
                    }
                ])

                if (!user) {
                    return res.status(404).json({
                        message: "User not found.",
                        success: false
                    })
                }

                const cart = [];
                let subtotal = 0;

                user.forEach((item) => {
                    cart.push({
                        quantity: item.cart.quantity,
                        productId: encryptObjectId(item.productInfo._id.toString()),
                        name: item.productInfo.name,
                        images: item.productInfo.images,
                        price: Number(item.productInfo.price.toString()),
                        weight: item.productInfo.weight,
                        company: item.productInfo.company,
                        category: item.productInfo.category,
                        discount: item.cart.discount
                    })

                    subtotal += (Number(item.productInfo.price.toString()) * item.cart.quantity);
                })

                return res.status(200).json({
                    data: { cart, subtotal },
                    success: true,
                    message: "Cart get successfully."
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