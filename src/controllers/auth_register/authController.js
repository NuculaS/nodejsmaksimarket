import { createHmac } from 'crypto';
import dotenv from 'dotenv';
import User from '../../models/User.js';
import { generateAccessToken } from './utils.js';

dotenv.config();

export function getAuthorization(req, res) {
    let { error, page } = req.query;

    if (error === 'auth') {
        error = 'Пользователь не авторизован';
    }

    if (page) {
        page = `?page=${page}`;
    }

    return res.render('index', {
        showFooter: false,
        element: 'auth_register/auth',
        options: {
            error,
            page,
            showLogout: true,
        },
    });
}

export async function postAuthorization(req, res) {
    let { page } = req.query;

    if (page) {
        page = `?page=${page}`;
    }

    const { email, password } = req.body;

    const userData = {
        email,
    };

    const user = await User.findOne(userData);

    if (!user) {
        return res.render('index', {
            showFooter: false,
            element: 'auth_register/auth',
            options: {
                error: 'Пользователь не найден',
                page,
                showLogout: true,
            },
        });
    }

    const secret = process.env.SECRET;
    const hashPassword = createHmac('sha256', secret)
        .update(password)
        .digest('hex');

    if (user.password !== hashPassword) {
        return res.render('index', {
            showFooter: false,
            element: 'auth_register/auth',
            options: {
                error: 'Неверный пароль',
                page,
                showLogout: true,
            },
        });
    }

    const token = generateAccessToken(user._id, user.roles);
    res.cookie('token', token, { httpOnly: true });

    if (page?.split('=')[1] === 'order') {
        return res.redirect('/order');
    } else if (page?.split('=')[1] === 'home') {
        return res.redirect('/home');
    }

    return res.redirect('/products');
}
