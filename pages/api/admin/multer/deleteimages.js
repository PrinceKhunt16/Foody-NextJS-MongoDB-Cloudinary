import fs from "fs"

export default async function handler(req, res) {
    if (req.method === "PUT") {
        req.body.urls.forEach((url) => {
            fs.unlink(`public/user/images/dynamic/products/${url}`, (err) => {
                if (err) {
                    return res.status(404).json({
                        message: "Image not found.",
                        success: false
                    })
                }
            })
        });

        return res.status(200).json({
            message: "Image deleted successfully.",
            success: true
        })
    }

    return res.status(405).json({
        message: "Method not allowed.",
        success: false
    })
}