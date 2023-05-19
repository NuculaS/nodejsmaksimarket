import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function generateAccessToken(id, roles) {
    const payload = {
        id,
        roles,
    };

    return jwt.sign(payload, process.env.SECRET, { expiresIn: '24h' });
}
