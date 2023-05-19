import { Router } from 'express';
import {
    deleteProductById,
    getProductById,
    getProducts,
} from '../controllers/index.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
import { check } from 'express-validator';

export const router = new Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/:id', roleMiddleware(['ADMIN']), deleteProductById);
