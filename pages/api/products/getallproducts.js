import dbConnect from "@/helper/dbConnect";
import Product from "@/models/product";
import { encryptObjectId } from "@/utils/objectId";

export default async function handler(req, res) {
    await dbConnect()

    if (req.method === "POST") {
        const response = await Product.find().skip(req.body.page * req.body.documents).limit(req.body.documents);
        const pages = Math.ceil(await Product.count() / req.body.documents);
        const data = [];

        response.forEach((product) => {
            data.push({
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
                createdOn: product.createdOn,
                reviews: product.reviews,
                status: product.status
            })
        });

        return res.status(200).json({
            data: data,
            pages: pages,
            message: "All products.",
            success: true
        })
    }

    return res.status(405).json({
        message: "Method not allowed.",
        success: false
    })
}