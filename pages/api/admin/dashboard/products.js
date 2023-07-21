import dbConnect from "@/helper/dbConnect";
import Product from "@/models/product";

function countStatusObjects(data, status) {
    let count = 0;

    data.forEach(item => {
        if (item.status === status) {
            count++;
        }
    });

    return count;
}

export default async function (req, res) {
    dbConnect();

    if (req.method === "GET") {
        try {
            let totals = {
                total: 0,
                inStock: 0,
                outOfStock: 0
            };

            const response = await Product.aggregate([
                {
                    $project: {
                        status: 1
                    }
                }
            ])

            totals = {
                ...totals,
                total: response.length,
                inStock: countStatusObjects(response, 1),
                outOfStock: countStatusObjects(response, 0)
            }

            return res.status(200).json({
                data: totals,
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