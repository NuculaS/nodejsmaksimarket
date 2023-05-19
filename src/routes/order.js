import { Router } from 'express';
import {
    getOrderPage,
    getOrderRedirectPage,
    postOrder,
} from '../controllers/index.js';
import { check } from 'express-validator';

export const router = new Router();

router.get('/', getOrderPage);
router.get('/:id', getOrderRedirectPage);
router.post(
    '/',
    [
        check('name', 'Имя не может быть пустым').notEmpty(),
        check('address', 'Адрес не может быть пустым').notEmpty(),
        check('phone', 'Номер телефона не может быть пустым').notEmpty(),
    ],
    postOrder
);
