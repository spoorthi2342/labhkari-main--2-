import mongoose, { Schema, Document } from 'mongoose';

// Define a schema for the sequence collection
interface SequenceDocument extends Document {
    _id: string;
    sequence_value: number;
}

const SequenceSchema: Schema<SequenceDocument> = new Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: 0 }
});

// Create a model for the sequence collection
const SequenceModel = mongoose.model<SequenceDocument>('Sequence', SequenceSchema);

// Define your product schema
interface ProductDocument extends Document {
    customId: number;
    title: string;
    description: string;
    category: string;
    image: string;
    price: number;
    ratings: number;
    tag: string;
    gst: string;
    weight: string;
}

const ProductSchema: Schema<ProductDocument> = new Schema({
    customId: { type: Number, unique: true }, // Changed to `id` to avoid confusion with MongoDB `_id`
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    ratings: { type: Number, required: true },
    tag: { type: String, required: true },
    gst: { type: String, required: true },
    weight: { type: String, required: true }
});

// Pre-save hook to generate auto-incrementing ID
ProductSchema.pre('save', async function (next) {
    if (!this.isNew) {
        return next();
    }

    try {
        const sequence = await SequenceModel.findByIdAndUpdate(
            { _id: 'productId' },
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        );

        (this as ProductDocument).customId = sequence.sequence_value;
        next();
    } catch (error: any) {
        next(error);
    }
});

// Create a model for the product schema
const ProductModel = mongoose.model<ProductDocument>('Product', ProductSchema);

export default ProductModel;
