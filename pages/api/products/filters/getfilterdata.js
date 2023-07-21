import dbConnect from "@/helper/dbConnect";
import Product from "@/models/product";
import { encryptObjectId } from "@/utils/objectId";

function getMinimumRanges(nums) {
    const minimum = [];
    const sorted = nums.sort((a, b) => a.min - b.min);

    for (let i = 0; i < sorted.length; i++) {
        if (minimum.length === 0) {
            minimum.push(sorted[i]);
        } else {
            let previous = minimum[minimum.length - 1];

            if (previous.max === sorted[i].min) {
                minimum.pop();
                minimum.push({ min: previous.min, max: sorted[i].max });
            } else {
                minimum.push(sorted[i]);
            }
        }
    }

    return minimum;
}

export default async function handler(req, res) {
    await dbConnect()

    if (req.method === "POST") {
        const { prices, company, preferencies, origin, discount, weights, ratings } = req.body.query;
        const data = [];
        const filter = {};
        let products = [];
        let pages;

        if (prices.length === 0 && company === "" && preferencies.length === 0 && origin === "" && discount === null && weights.length === 0 && ratings.length === 0) {
            products = await Product.find().skip(req.body.page * req.body.documents).limit(req.body.documents);
            pages = Math.ceil(await Product.count() / req.body.documents);
        } else {
            if (prices.length) {
                const minifyPrices = getMinimumRanges(prices);

                const condition = minifyPrices.map(range => ({
                    price: { $gte: range.min, $lte: range.max }
                }));

                if (filter.$or) {
                    filter.$or = [...filter.$or, ...condition];
                } else {
                    filter.$or = condition;
                }
            }

            if (preferencies.length) {
                filter.preferences = { $in: preferencies.map(preferences => preferences) };
            }

            if (company) {
                filter.company = company;
            }

            if (origin) {
                filter.origin = origin;
            }

            if (ratings.length) {
                const values = ratings.map(num => parseFloat(num.toFixed(1)));

                const condition = values.map(rating => ({
                    rating: { $gte: rating - 0.9, $lte: rating }
                }));

                if (filter.$or) {
                    filter.$or = [...filter.$or, ...condition];
                } else {
                    filter.$or = condition;
                }
            }

            if (discount) {
                const condition = [{ discount: { $gte: 0, $lte: discount } }]

                if (filter.$and) {
                    filter.$and = [...filter.$and, ...condition];
                } else {
                    filter.$and = condition;
                }
            }

            if (weights.length) {
                const minifyWeight = getMinimumRanges(weights);

                filter.$or = minifyWeight.map(range => ({
                    weight: { $gte: range.min, $lte: range.max }
                }));
            }

            products = await Product.find(filter);
            pages = Math.ceil(products.length / req.body.documents);
            products = products.slice(req.body.page * req.body.documents, (req.body.page * req.body.documents) + req.body.documents);
        }

        products.forEach((product) => {
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
            message: "Filter data for products.",
            success: true
        })
    }

    return res.status(405).json({
        message: "Method not allowed.",
        success: false
    })
}