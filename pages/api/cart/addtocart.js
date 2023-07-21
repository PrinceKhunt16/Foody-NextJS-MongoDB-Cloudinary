import dbConnect from "@/helper/dbConnect"
import User from "@/models/user"
import { withSessionRoute } from "@/helper/ironsession"
import { decryptObjectId } from "@/utils/objectId"

export default withSessionRoute(async function (req, res) {
    await dbConnect()

    if (req.method === 'POST') {
        if (req.session.user === undefined) {
            return res.status(401).json({
                message: "User should be logged in.",
                success: false
            })
        }

        const user = await User.findOne({ _id: req.session.user.id });
        const reqBodyProductId = decryptObjectId(req.body.productId);
        let newCart = user.cart.slice();

        if (req.body.status) {
            if (user.cart.length === 0) {
                newCart.push({ productId: reqBodyProductId, quantity: req.body.quantity });
            } else {
                if (newCart.map(c => c.productId.toString()).includes(reqBodyProductId)) {
                    newCart = newCart.map(c => c.productId.toString() == reqBodyProductId ? { productId: reqBodyProductId, quantity: req.body.quantity } : { productId: c.productId.toString(), quantity: c.quantity })
                } else {
                    newCart.push({ productId: reqBodyProductId, quantity: req.body.quantity })
                }
            }
        } else {
            newCart = newCart.map(c => ({ productId: c.productId.toString(), quantity: c.quantity }))
            newCart = newCart.filter(c => c.productId !== reqBodyProductId)
        }

        await User.findOneAndUpdate({ _id: req.session.user.id }, { cart: newCart });

        if (req.body.status) {
            return res.status(200).json({
                message: "Product added in cart successfully.",
                success: true
            })
        } else {
            return res.status(200).json({
                message: "Product removed from cart successfully.",
                success: true
            })
        }
    }

    return res.status(405).json({
        message: "Method not allowed.",
        success: false
    })
})