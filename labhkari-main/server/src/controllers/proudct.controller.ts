import { Request, Response } from 'express';
import ProductModel from '../models/Product.model';
import AWS from 'aws-sdk';

// Assuming the AWS configuration is already set up in your environment
const s3 = new AWS.S3({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY || '',
        secretAccessKey: process.env.SECRET_KEY || '',
    },
    region: process.env.REGION,
});


export const addProduct = async (req: Request, res: Response) => {
    const { title, ratings, price, description, tag, gst, weight } = req.body;
    try {
        if (!req.files || !req.files.length) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        const imageUrls = (req.files as Express.MulterS3.File[]).map(file => file.location).join(',');

        const newProduct = new ProductModel({
            title,
            ratings,
            image: imageUrls, // Store the image URLs in the image field
            price,
            description,
            tag,
            gst,
            weight,
            category: "Food"
        });

        const savedProduct = await newProduct.save();
        console.log(savedProduct);

        res.status(200).json({
            success: true,
            message: "Product added successfully",
            data: savedProduct
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}


export const getProduct = async (req: Request, res: Response) => {
    try {
        const products = await ProductModel.find();
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

export const getProductID = async (req: Request, res: Response) => {
    const { customId } = req.body;
    try {
        // Fetch product by ID
        const product = await ProductModel.find({ customId: customId });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Respond with the product data
        return res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Internal server error");
    }
}

// Function to get products by category
export const getProductCat = async (req: Request, res: Response) => {
    const { category } = req.body;
    try {
        // Fetch products by category
        const products = await ProductModel.find({ category });

        if (!products.length) {
            return res.status(404).json({
                success: false,
                message: "No products found in this category"
            });
        }

        // Respond with the product data
        return res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Internal server error");
    }
}
