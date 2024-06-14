import { Request, Response } from 'express';
import CartModel from '../models/Cart.model';

export const fetchCart = async (req: Request, res: Response) => {
    try {
        const { uid } = req.body;
        if (!uid) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // Find cart items for the given user ID
        const cartItems = await CartModel.find({ userId: uid });

        return res.status(200).json({
            success: true,
            data: cartItems
        });
    } catch (error) {
        console.error("Error fetching carts:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const addCartItem = async (req: Request, res: Response) => {
    try {
        const { customId, userId, count, title, image, price, ref, gst, weight } = req.body;

        // Check if the item already exists in the cart
        const existingCartItem = await CartModel.findOne({ customId, userId });

        if (existingCartItem) {
            // If the item exists, update its count
            existingCartItem.count += count;
            await existingCartItem.save();
            return res.status(200).json({
                success: true,
                count: existingCartItem.count,
                message: "Cart item count updated successfully",
            });
        } else {
            // If the item does not exist, insert a new item into the cart
            const cartItem = new CartModel({
                customId, userId, count, title, price, image, ref, gst, weight
            });
            await cartItem.save();
            return res.status(200).json({
                success: true,
                count,
                message: "Item added to cart successfully",
            });
        }
    } catch (error: any) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const deleteCartItem = async (req: Request, res: Response) => {
    try {
        const { uid, customId } = req.body;
        if (!customId) {
            return res.status(400).json({ success: false, message: "ID is required" });
        }

        // Delete the cart item
        await CartModel.deleteOne({ customId: customId, userId: uid });

        // Fetch updated cart data after deletion
        const updatedCartItems = await CartModel.find({ userId: uid });

        return res.status(200).json({
            success: true,
            message: "Cart item deleted successfully",
            cartItems: updatedCartItems,
        });
    } catch (error) {
        console.error("Error deleting carts:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const updateCartUserId = async (req: Request, res: Response) => {
    try {
        const { oldUid, newUid } = req.body;
        if (!oldUid || !newUid) {
            return res.status(400).json({ success: false, message: "Old UID and New UID are required" });
        }

        // Check if the old UID exists in the cart collection
        const cartItems = await CartModel.find({ userId: oldUid });

        // If no items found with old UID, return error
        if (cartItems.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Old UID not found in cart",
            });
        }

        // Update the userId from oldUid to newUid
        await CartModel.updateMany({ userId: oldUid }, { userId: newUid });

        return res.status(200).json({
            success: true,
            message: "User ID updated successfully in cart",
        });
    } catch (error) {
        console.error("Error updating cart user ID:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
