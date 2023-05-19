import { validationResult } from 'express-validator';
import Product from '../models/Product.js';
import * as path from 'path';
import * as uuid from 'uuid';

export function getCreatePage(req, res) {
    try {
        return res.render('index', {
            showFooter: true,
            element: 'create/create',
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

export async function productCreate(req, res) {
    try {
        const errorsList = validationResult(req);

        // Проверка на то, что нет ошибок валидации формы
        if (!errorsList.isEmpty()) {
            return res.render('index', {
                showFooter: false,
                element: 'create/create',
                options: {
                    error: errorsList.errors[0].msg,
                },
            });
        }

        const { name, description, cost } = req.body;
        const { picture } = req.files;

        const fileName =
            uuid.v4() + picture.name.slice(picture.name.lastIndexOf('.'));
        const filePath = path.resolve('public/pictures', fileName);
        await picture.mv(filePath);

        const productData = {
            name,
            description,
            cost,
            picture: fileName,
        };

        const product = await Product.create(productData);
        return res.redirect(`/products/${product._id}`);
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
