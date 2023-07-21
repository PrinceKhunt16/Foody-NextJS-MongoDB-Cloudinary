import mongoose, { model, models, Schema } from "mongoose";

const productSchema = new Schema(
    {
        name: { type: String, required: true },
        images: { type: [String], required: true },
        price: { type: mongoose.Types.Decimal128, required: true },
        wrongPrice: { type: mongoose.Types.Decimal128, required: true },
        weight: { type: Number, required: true },
        company: { type: String, required: true },
        category: { type: String, required: true },
        preferences: { type: String, required: true },
        origin: { type: String, required: true },
        discount: { type: mongoose.Types.Decimal128, default: 0 },
        rating: { type: mongoose.Types.Decimal128, default: 0 },
        status: { type: Number, default: 1 },
        reviews: [
            {
                userId: { type: mongoose.Types.ObjectId, required: true },
                stars: { type: Number, required: true },
                message: { type: String },
            }
        ],
        createdOn: { type: Number, required: true },
        updatedOn: { type: Number, required: true }
    },
    {
        versionKey: false,
    }
);

export default models.Product || model("Product", productSchema);
