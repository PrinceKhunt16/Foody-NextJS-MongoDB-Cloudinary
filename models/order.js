import mongoose, { model, models, Schema } from "mongoose"

/*

ORDER STATUS DESCRIPTION
0            ORDERED
1            ACCEPTED 
2            SHIPPED
3            DELIVERED
4            CANCELED

*/

/*

ORDER STATUS DESCRIPTION
0            PENDING
1            ACCEPTED 
2            REFUNDED

*/

const orderSchema = new Schema(
    {
        products: [
            {
                productId: { type: mongoose.Types.ObjectId, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true }
            }
        ],
        userId: { type: mongoose.Types.ObjectId, required: true },
        orderId: { type: Number, required: true },
        status: { type: Number, default: 4 },
        country: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        address: { type: String, required: true },
        pincode: { type: Number, required: true },
        otp: { type: String },
        otptimestamp: { type: Number },
        payment: { type: Number, default: 0 },
        paymentIntentId: { type: String },
        createdOn: { type: Number, required: true }
    },
    {
        versionKey: false
    }
)

export default models.Order || model("Order", orderSchema);