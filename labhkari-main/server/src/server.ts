import express, { Application, Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import authRouter from "./routes/auth.routes";
import cartRouter from "./routes/cart.routes";
import productRouter from "./routes/product.routes";
import paytmRouter from "./routes/payment.routes";
import orderRouter from "./routes/order.routes";
import dbConnection from "./config/dbConnection";
import path from "path";
import multerS3 from 'multer-s3';
import { S3Client } from "@aws-sdk/client-s3";

const app: Application = express();

const s3 = new S3Client({
    region: process.env.REGION!,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY!,
        secretAccessKey: process.env.SECRET_KEY!,
    },
});

const uploadWithMulter = () => multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME!,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + path.extname(file.originalname));
        },
    }),
}).array("s3Images", 2);

const uploadToAws = (req: Request, res: Response, next: Function) => {
    const upload = uploadWithMulter();

    upload(req, res, err => {
        if (err) {
            console.log(err);
            return res.status(500).json({ err, msg: "Error occurred while uploading" });
        }
        next(); // Call the next middleware if upload is successful
    });
}

// Use middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
    cors({
        origin: process.env.CLIENT_URL || "",
        methods: "GET, POST, PUT, DELETE",
        credentials: true,
    })
);

// Define routes
app.use("/auth", authRouter);
app.use("/cart", cartRouter);
app.use("/product", uploadToAws, productRouter); // Apply upload middleware to product routes
app.use("/paytm", paytmRouter);
app.use("/order", orderRouter);

// Route for getting paytm key
app.get("/paytm/getkey", (req: Request, res: Response) =>
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID })
);

// Initialize database connection
dbConnection.on("connected", () => {
    const PORT: string | number = process.env.PORT || 4000;
    app.listen(PORT, () =>
        console.log("Server started running at the PORT:", PORT)
    );
});

// Handle database connection errors
dbConnection.on("error", (error: Error) => {
    console.error("Error connecting to the database:", error.message);
    process.exit(1);
});
