import mongoose, { model, models, Schema } from "mongoose"

const userSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        avatar: { type: String, required: true },
        type: { type: mongoose.Types.Decimal128, enum: [0, 1], default: 0 },
        status: { type: mongoose.Types.Decimal128, enum: [0, 1], default: 1 },
        createdOn: { type: mongoose.Types.Decimal128, required: true },
        updatedOn: { type: mongoose.Types.Decimal128, required: true },
        cart: [
            {
                productId: { type: mongoose.Types.ObjectId, required: true },
                quantity: { type: Number, required: true }
            }
        ]
    },
    {
        versionKey: false
    }
)

export default models.User || model("User", userSchema)