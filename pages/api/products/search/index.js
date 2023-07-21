import dbConnect from "@/helper/dbConnect";
import Product from "@/models/product";
import { encryptObjectId } from "@/utils/objectId";

export default async function handler(req, res) {
    await dbConnect()

    if (req.method === "POST") {
        const data = [];
        let qry = [];

        qry.push({ name: { $regex: `(?i)${req.body.query}` } })
        qry.push({ company: { $regex: `(?i)${req.body.query}` } })
        qry.push({ category: { $regex: `(?i)${req.body.query}` } })
        qry.push({ preferences: { $regex: `(?i)${req.body.query}` } })
        qry.push({ origin: { $regex: `(?i)${req.body.query}` } })

        const response = await Product.find({ $or: qry }, "name images price");

        response.forEach((product) => {
            data.push({
                id: encryptObjectId(product.id),
                name: product.name,
                images: product.images,
                price: product.price.toString()
            })
        });

        return res.status(200).json({
            data: data,
            message: "Filter data for products.",
            success: true
        })
    }

    return res.status(405).json({
        message: "Method not allowed.",
        success: false
    })
}