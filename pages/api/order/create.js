import dbConnect from "@/helper/dbConnect"
import Order from "@/models/order"
import User from "@/models/user"
import { withSessionRoute } from "@/helper/ironsession"
import { decryptObjectId } from "@/utils/objectId"

export default withSessionRoute(async function (req, res) {
    await dbConnect()

    if (req.method == "POST") {
        try {
            try {
                const products = req.body.order.products.map((p) => ({
                    productId: decryptObjectId(p.id),
                    price: p.price,
                    quantity: p.quantity
                }));

                const newOrder = new Order({
                    userId: req.session.user.id,
                    orderId: parseInt(`${Date.now()}${Math.floor(Math.random() * 999999)}`),
                    products: products,
                    address: req.body.order.address,
                    pincode: req.body.order.pincode,
                    country: req.body.order.country,
                    state: req.body.order.state,
                    status: 0,
                    city: req.body.order.city,
                    createdOn: Date.now(),
                });

                await newOrder.save();

                await User.findByIdAndUpdate(req.session.user.id, {
                    cart: []
                });

                const amount = newOrder.products.reduce((acc, item) => acc + (item.price * item.quantity), 0)

                return res.status(201).json({
                    data: {
                        orderId: newOrder.orderId,
                        amount: amount
                    },
                    success: true,
                    message: "Order created successfully."
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