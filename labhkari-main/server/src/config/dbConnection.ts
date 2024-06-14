import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Connect to MongoDB
const mongoUri: string = process.env.MONGO_URI as string;

mongoose.connect(mongoUri)
    .then(() => console.log('Connected to Database'))
    .catch((error) => console.error('MongoDB connection error:', error));

export default mongoose.connection;
