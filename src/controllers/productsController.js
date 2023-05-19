import Product from '../models/Product.js';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

export async function getProducts(req, res) {
    try {
        let page = 0;
        const pageLimit = 8;

        if (req.query.page && Number(req.query.page) < 1) {
            return res.redirect('/products');
        }

        page = (Number(req.query.page) || 1) - 1;

        const products = await Product.find()
            .skip(pageLimit * page)
            .limit(pageLimit);
        const countOfPages = (await Product.find().count()) / pageLimit;

        if (!products || !products.length) {
            return res.render('index', {
                showFooter: false,
                element: 'errors/error',
                options: {
                    error: 'Товары не найдены',
                },
            });
        }

        return res.render('index', {
            showFooter: true,
            element: 'products/productsList',
            options: {
                products,
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
                error: e,
            },
        });
    }
}

export async function getProductById(req, res) {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.render('index', {
                showFooter: false,
                element: 'errors/error',
                options: {
                    error: 'Товар не найден',
                },
            });
        }

        const token = req.cookies.token;
        if (token) {
            const { roles: userRoles, id } = jwt.verify(
                token,
                process.env.SECRET
            );
            let isAdmin = false;
            userRoles.forEach(role => {
                if (role === 'ADMIN') {
                    isAdmin = true;
                }
            });

            if (isAdmin) {
                return res.render('index', {
                    showFooter: true,
                    element: 'products/productPageDelete',
                    options: {
                        product,
                    },
                });
            }
        }

        return res.render('index', {
            showFooter: true,
            element: 'products/productPage',
            options: {
                product,
            },
        });
    } catch (e) {
        console.log(e);
        return res.render('index', {
            showFooter: false,
            element: 'errors/error',
            options: {
                error: 'Некорректный адрес товара',
            },
        });
    }
}

export async function deleteProductById(req, res) {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.render('index', {
                showFooter: false,
                element: 'errors/error',
                options: {
                    error: 'Товар не удалось удалить',
                },
            });
        }

        const filePath = path.resolve('public/pictures', product.picture);
        await fs.unlinkSync(filePath);

        return res.redirect('/products');
    } catch (e) {
        console.log(e);
        return res.render('index', {
            showFooter: false,
            element: 'errors/error',
            options: {
                error: 'Некорректный адрес товара',
            },
        });
    }
}
