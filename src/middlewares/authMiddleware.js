import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }

    const page = req.baseUrl.slice(1);

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect(`/auth?error=auth&page=${page}`);
        }

        req.user = jwt.verify(token, process.env.SECRET);
        next();
    } catch (e) {
        console.log(e);
        return res.redirect(`/auth?error=auth&page=${page}`);
    }
}
