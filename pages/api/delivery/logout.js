import { withSessionRoute } from "@/helper/ironsession";

export default withSessionRoute(async function (req, res) {
    if (req.method === "DELETE") {
        try {
            const store = req.session

            delete store.delivery

            await req.session.save();

            res.send({
                message: "Logout successfully.",
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