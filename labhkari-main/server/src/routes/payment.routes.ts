import { Router } from 'express';
import { checkOut, paymentVerification } from '../controllers/payment.controller';

const route = Router();

// Define the route for initiating the checkout process
route.post("/checkout", checkOut);

// Define the route for handling payment verification
route.post("/paymentverification", paymentVerification);

export default route;
