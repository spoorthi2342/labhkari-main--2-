import { RequestHandler } from "express";
import { instance } from "../config/razorConnection";
import crypto from "crypto";
import dotenv from "dotenv";
import OrderModel from "../models/Order.model";

dotenv.config();

const checkOut: RequestHandler = async (req, res) => {
    const options = {
        amount: Number(req.body.amount * 100),
        currency: "INR",
    };
    const order = await instance.orders.create(options);
    res.status(200).json({
        success: true,
        order,
    });
};

const paymentVerification: RequestHandler = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET || '')
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        try {
            res.redirect(`http://localhost:3000/success?reference=${razorpay_payment_id}&success=true`);
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    } else {
        res.status(400).json({
            success: false,
            message: "Invalid signature"
        });
    }
};

export { checkOut, paymentVerification }
