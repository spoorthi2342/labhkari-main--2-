import { Router } from 'express';
import { addOrder, fetchOrder, fetchOrdersByUserId } from '../controllers/order.controller';

const router = Router();

router.post("/addOrder", addOrder)
router.post('/fetchOrder', fetchOrder)
router.post('/userID', fetchOrdersByUserId)

export default router;
