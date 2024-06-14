import { Router } from 'express';
import { fetchCart, addCartItem, deleteCartItem, updateCartUserId } from '../controllers/cart.controller';

const router = Router();

router.post('/fetch', fetchCart);
router.post('/add', addCartItem);
router.post('/delete', deleteCartItem);
router.post('/update', updateCartUserId);

export default router;
