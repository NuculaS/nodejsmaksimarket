import express from 'express';
import { check } from 'express-validator';
import { getRegistration, postRegistration } from '../../controllers/index.js';

const confirmPasswordValidator = () =>
    check(['passwordConfirm'])
        .trim()
        .isLength({ min: 4, max: 16 })
        .withMessage('Длина пароля должна быть более 4 символов и менее 16')
        .custom(async (passwordConfirm, { req }) => {
            const password = req.body.password;
            if (password !== passwordConfirm) {
                throw new Error('Пароли не совпадают');
            }
        });

export const router = express.Router();

router.get('/', getRegistration);
router.post(
    '/',
    [
        check('email', 'Некорректный email').isEmail(),
        confirmPasswordValidator(),
    ],
    postRegistration
);
