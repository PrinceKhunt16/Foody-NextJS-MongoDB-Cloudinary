import dbConnect from "@/helper/dbConnect";
import Product from "@/models/product";

export default async function handler(req, res) {
    await dbConnect()

    if (req.method === "GET") {
        const companiesData = [], preferenciesData = [], originData = [];
        const companies = await Product.aggregate([
            {
                $group: {
                    _id: {
                        company: "$company"
                    }
                }
            }
        ])

        companies.forEach(company => {
            companiesData.push(company._id.company)
        })

        const preferencies = await Product.aggregate([
            {
                $group: {
                    _id: {
                        preferences: "$preferences"
                    }
                }
            }
        ])

        preferencies.forEach(preferences => {
            preferenciesData.push(preferences._id.preferences)
        })

        const origin = await Product.aggregate([
            {
                $group: {
                    _id: {
                        origin: "$origin"
                    }
                }
            }
        ])

        origin.forEach(origin => {
            originData.push(origin._id.origin)
        })

        return res.status(200).json({
            data: {
                companiesData,
                preferenciesData,
                originData
            },
            message: "Filter data for products.",
            success: true
        })
    }

    return res.status(405).json({
        message: "Method not allowed.",
        success: false
    })
}