import { validationResult } from 'express-validator';
import Order, { ORDER_STATUS } from '../models/Order.js';

export function getOrderPage(req, res) {
    try {
        return res.render('index', {
            showFooter: true,
            element: 'order/order',
            options: {},
        });
    } catch (e) {
        console.log(e);
        return res.render('index', {
            showFooter: false,
            element: 'errors/error',
            options: {
                error: 'Непредвиденная ошибка',
            },
        });
    }
}

export async function postOrder(req, res) {
    try {
        const errorsList = validationResult(req);

        // Проверка на то, что нет ошибок валидации формы
        if (!errorsList.isEmpty()) {
            return res.render('index', {
                showFooter: false,
                element: 'order/order',
                options: {
                    error: errorsList.errors[0].msg,
                },
            });
        }

        const { name, address, phone } = req.body;
        const userId = req.userId;
        const products = JSON.parse(req.cookies.cart);

        const orderData = {
            userId,
            name,
            address,
            phone,
            products,
        };

        const order = await Order.create(orderData);
        return res.redirect(`/order/${order._id}`);
    } catch (e) {
        console.log(e);
        return res.render('index', {
            showFooter: false,
            element: 'errors/error',
            options: {
                error: 'Непредвиденная ошибка',
            },
        });
    }
}

export async function getOrderRedirectPage(req, res) {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const order = await Order.findById(id);

        if (
            !order.userId ||
            order.userId !== userId ||
            order.status !== ORDER_STATUS.CREATED
        ) {
            return res.redirect('/home');
        }

        order.status = ORDER_STATUS.PROCESSED;
        await order.save();

        return res.render('index', {
            showFooter: true,
            element: 'order/orderSuccess',
            options: {
                id,
            },
        });
    } catch (e) {
        console.log(e);
        return res.render('index', {
            showFooter: false,
            element: 'errors/error',
            options: {
                error: 'Непредвиденная ошибка',
            },
        });
    }
}
