import { Router } from 'express';
import { getCart } from '../controllers/index.js';

export const router = new Router();

router.get('/', getCart);
