import dbConnect from "@/helper/dbConnect";
import User from "@/models/user";

function countTypesObjects(data, status) {
    let count = 0;

    data.forEach(item => {
        if (Number(item.type.toString()) === status) {
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
                users: 0,
                admins: 0,
                deliveryBoys: 0,
                blockedUsers: 0,
                blockedAdmins: 0,
                blockedDeliveryBoys: 0
            };

            const response = await User.aggregate([
                {
                    $project: {
                        status: 1,
                        type: 1
                    }
                }
            ])

            totals = {
                ...totals,
                total: response.length,
                users: countTypesObjects(response, 0),
                admins: countTypesObjects(response, 1),
                deliveryBoys: countTypesObjects(response, 2)
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