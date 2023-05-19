import { createHmac } from 'crypto';
import { validationResult } from 'express-validator';
import dotenv from 'dotenv';
import User from '../../models/User.js';
import Role from '../../models/Role.js';
import { generateAccessToken } from './utils.js';

dotenv.config();

export function getRegistration(req, res) {
    let { page } = req.query;

    if (page) {
        page = `?page=${page}`;
    }

    return res.render('index', {
        showFooter: false,
        element: 'auth_register/register',
        options: {
            page,
            showLogout: true,
        },
    });
}

export async function postRegistration(req, res) {
    let { page } = req.query;

    if (page) {
        page = `?page=${page}`;
    }

    try {
        const { email, password } = req.body;
        const errorsList = validationResult(req);

        // Проверка на то, что нет ошибок валидации формы
        if (!errorsList.isEmpty()) {
            return res.render('index', {
                showFooter: false,
                element: 'auth_register/register',
                options: {
                    error: errorsList.errors[0].msg,
                    page,
                    showLogout: true,
                },
            });
        }

        // Проверка на то, что такой пользователь уже существует
        const candidate = await User.findOne({ email });
        if (candidate) {
            return res.render('index', {
                showFooter: false,
                element: 'auth_register/register',
                options: {
                    error: 'Пользователь с таким email уже существует',
                    page,
                    showLogout: true,
                },
            });
        }

        // Шифрование пароля
        const secret = process.env.SECRET;
        const hashPassword = createHmac('sha256', secret)
            .update(password)
            .digest('hex');

        const userRole = await Role.findOne({ value: 'USER' });
        const userData = {
            email,
            password: hashPassword,
            roles: [userRole.value],
        };

        const user = await User.create(userData);
        console.log(user);

        if (user.password !== hashPassword) {
            return res.render('index', {
                showFooter: false,
                element: 'auth_register/register',
                options: {
                    error: 'Неверный пароль',
                    page,
                    showLogout: true,
                },
            });
        }

        const token = generateAccessToken(user._id, user.roles);
        res.cookie('token', token, { httpOnly: true });

        if (page.split('=')[1] === 'order') {
            return res.redirect('/order');
        } else if (page.split('=')[1] === 'home') {
            return res.redirect('/home');
        }

        return res.redirect('/products');
    } catch (e) {
        return res.render('index', {
            showFooter: false,
            element: 'auth_register/register',
            options: {
                error: 'Непредвиденная ошибка',
                page,
                showLogout: true,
            },
        });
    }
}
