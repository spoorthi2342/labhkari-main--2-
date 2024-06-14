import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    customId: { type: Number, required: true },
    userId: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    count: { type: Number, required: true },
    referralId: { type: String, default: null }, // Nullable field
    gst: { type: String, required: true },
    weight: { type: String, required: true }
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
