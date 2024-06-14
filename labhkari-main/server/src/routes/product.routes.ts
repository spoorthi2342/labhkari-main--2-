import { Router } from 'express';
import { addProduct, getProduct, getProductID, getProductCat } from '../controllers/proudct.controller';

const router = Router();

router.post('/add', addProduct);
router.get('/get', getProduct);
router.post('/getid', getProductID);
router.post('/getcat', getProductCat);

export default router;
