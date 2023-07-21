import dbConnect from "@/helper/dbConnect";
import Product from "@/models/product";
import { decryptObjectId, encryptObjectId } from "@/utils/objectId";

export default async function handler(req, res) {
    await dbConnect()

    if (req.method === "GET") {
        const product = await Product.findById({ _id: decryptObjectId(req.query.productId) })

        const data = {
            id: encryptObjectId(product.id),
            name: product.name,
            images: product.images,
            price: product.price.toString(),
            wrongPrice: product.wrongPrice.toString(),
            weight: product.weight,
            company: product.company,
            category: product.category,
            preferences: product.preferences,
            origin: product.origin,
            discount: product.discount.toString(),
            rating: product.rating.toString(),
            status: product.status,
            reviews: product.reviews
        }

        return res.status(200).json({
            data: data,
            message: "Product status changed successfully.",
            success: true
        })
    }

    return res.status(405).json({
        message: "Method not allowed.",
        success: false
    })
}