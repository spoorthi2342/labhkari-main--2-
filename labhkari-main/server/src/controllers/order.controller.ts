import { Request, Response } from 'express';
import OrderModel from '../models/Order.model';

export const addOrder = async (req: Request, res: Response) => {
    try {
        const { orderId, email, name, phone, amount, amountPaid, userId, itemCount, shippingAddress, state, country, landmark, city, tag, pinCode } = req.body;

        const newOrder = new OrderModel({
            orderId, email, name, phone, amount, amountPaid, userId, itemCount, shippingAddress, state, country, landmark, city, tag, pinCode
        });

        const savedOrder = await newOrder.save();

        return res.status(200).json({
            success: true,
            message: "Order added successfully",
            data: savedOrder
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error adding Order to db",
            error: error.message
        });
    }
}

export const fetchOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.body;

        const order = await OrderModel.findOne({ orderId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            data: order
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error fetching order",
            error: error.message
        });
    }
}

export const fetchOrdersByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        const orders = await OrderModel.find({ userId });

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message
        });
    }
}
