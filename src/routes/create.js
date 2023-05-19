import { Router } from 'express';
import { productCreate, getCreatePage } from '../controllers/index.js';
import { check } from 'express-validator';

export const router = new Router();

router.get('/', getCreatePage);
router.post(
    '/',
    [
        check('name', 'Название продукта не может быть пустым').notEmpty(),
        check('description', 'Описание не может быть пустым').notEmpty(),
        check('cost', 'Стоимость не может быть пустым').notEmpty(),
    ],
    productCreate
);
