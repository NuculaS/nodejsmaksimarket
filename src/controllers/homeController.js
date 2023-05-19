import Order from '../models/Order.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

export async function getHomePage(req, res) {
    try {
        const user = req.user;

        let page = 0;
        const pageLimit = 3;

        if (req.query.page && Number(req.query.page) < 1) {
            return res.redirect('/home');
        }

        page = (Number(req.query.page) || 1) - 1;

        let orderList = [];
        let countOfPages = 0;

        if (user.roles.includes('ADMIN')) {
            orderList = await Order.find()
                .skip(pageLimit * page)
                .limit(pageLimit);
            countOfPages = (await Order.find().count()) / 3;
        } else {
            orderList = await Order.find({ userId: user.id })
                .skip(pageLimit * page)
                .limit(pageLimit);
            countOfPages =
                (await Order.find({ userId: user.id }).count(true)) / pageLimit;
        }

        if (!orderList || !orderList.length) {
            return res.render('index', {
                showFooter: false,
                element: 'errors/error',
                options: {
                    error: 'Заказы не найдены',
                },
            });
        }

        const uniqueIds = new Map();

        orderList.forEach(order => {
            order.products.forEach(product => {
                uniqueIds.set(product._id);
            });
        });

        // Находим в базе все продукты для формирования списка
        const products = await Product.find(
            {
                _id: {
                    $in: [...uniqueIds.keys()].map(
                        item => new mongoose.Types.ObjectId(item)
                    ),
                },
            },
            { name: 1, cost: 1 }
        );

        orderList = JSON.parse(JSON.stringify(orderList)).map(order => {
            let totalAmount = 0;
            order.products = order.products.map(product => {
                const productId = [...uniqueIds.keys()].indexOf(product._id);

                totalAmount += product.count * products[productId].cost;
                return {
                    ...product,
                    name: products[productId].name,
                    cost: products[productId].cost,
                };
            });

            return { ...order, totalAmount };
        });

        return res.render('index', {
            showFooter: true,
            element: 'home/home',
            options: {
                orderList,
                countOfPages,
                page: page + 1,
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
