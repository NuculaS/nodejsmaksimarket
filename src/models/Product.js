import { Schema, model } from 'mongoose';

/**
 * Схема продукта в MongoDB
 * @param {string} name - Название товара
 * @param {string} description - Описание товара
 * @param {number} cost - Стоимость товара (в рублях)
 * @param {string} picture - Ссылка на изображение товара
 */
const Product = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    cost: { type: Number, required: true },
    picture: { type: String, required: true },
});

export default model('Product', Product);
