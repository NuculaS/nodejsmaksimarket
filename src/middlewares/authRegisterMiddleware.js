export default function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }

    const token = req.cookies.token;
    if (token) {
        return res.redirect(`/products`);
    }

    next();
}
