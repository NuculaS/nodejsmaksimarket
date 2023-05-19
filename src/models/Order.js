import { Schema, model } from 'mongoose';

export const ORDER_STATUS = {
    CREATED: 'CREATED',
    PROCESSED: 'PROCESSED',
    DELIVERY: 'DELIVERY',
    RECEIVED: 'RECEIVED',
};

const Order = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, required: true, default: ORDER_STATUS.CREATED },
    products: [
        {
            _id: { type: String, required: true },
            count: { type: Number, required: true },
        },
    ],
});

export default model('Order', Order);
