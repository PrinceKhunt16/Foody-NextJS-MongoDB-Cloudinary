import dbConnect from "@/helper/dbConnect"
import Product from "@/models/product";
import { withSessionRoute } from "@/helper/ironsession";
import { checkDiscount, checkImagesFileNames, checkPrice, checkText, checkWeight } from "@/utils/validator";

export default withSessionRoute(async function (req, res) {
    await dbConnect();

    if (req.method === "POST") {
        try {
            const name = checkText("", req.body.name, 2, 100, false);
            const images = checkImagesFileNames("", req.body.images);
            const price = checkPrice("", req.body.price);
            const wrongPrice = checkPrice("", req.body.wrongPrice);
            const weight = checkWeight("", req.body.weight);
            const company = checkText("", req.body.company, 2, 100, false);
            const category = checkText("", req.body.category, 2, 100, false);
            const preferences = checkText("", req.body.preferences, 2, 100, false);
            const origin = checkText("", req.body.origin, 2, 100, false);
            const discount = checkDiscount("", req.body.discount);

            if (name.error || images.error || price.error || wrongPrice.error || weight.error || company.error || category.error || preferences.error || origin.error || discount.error) {
                return res.status(400).json({
                    message: "All field are required. You will have to give product name, images, price, wrongPrice, weight, company, category, preferences, origin and discount.",
                    success: false
                })
            }

            const newProduct = new Product({
                name: req.body.name,
                images: req.body.images,
                price: req.body.price,
                wrongPrice: req.body.wrongPrice,
                weight: req.body.weight,
                company: req.body.company,
                category: req.body.category,
                preferences: req.body.preferences,
                origin: req.body.origin,
                discount: req.body.discount,
                createdOn: Date.now(),
                updatedOn: Date.now()
            })

            await newProduct.save();

            return res.status(200).json({
                message: "Product created successfully.",
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
})