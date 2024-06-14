// routes/auth.routes.ts
import { Router } from 'express';
import { userLogin, userRef, userRegister } from '../controllers/auth.controller';

const route = Router();

route.post("/login", userLogin);
route.post("/register", userRegister);
route.post('/ref', userRef);

export default route;
