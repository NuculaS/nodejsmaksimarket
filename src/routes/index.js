import express from 'express';
import { authRouter, registerRouter } from './auth_register/index.js';
import { router as productsRouter } from './products.js';
import { router as cartRouter } from './cart.js';
import { router as orderRouter } from './order.js';
import { router as homeRouter } from './home.js';
import { router as logoutRouter } from './logout.js';
import { router as productCreateRouter } from './create.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authRegisterMiddleware from '../middlewares/authRegisterMiddleware.js';

export const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/products');
});

router.use('/auth', authRegisterMiddleware, authRouter);
router.use('/register', authRegisterMiddleware, registerRouter);
router.use('/logout', authMiddleware, logoutRouter);

router.use('/products', productsRouter);
router.use('/cart', cartRouter);

router.use('/create', roleMiddleware(['ADMIN']), productCreateRouter);

router.use('/order', roleMiddleware(['USER']), orderRouter);
router.use('/home', authMiddleware, homeRouter);

// router.get('*', (req, res) => {
//     res.redirect('/products');
// });
