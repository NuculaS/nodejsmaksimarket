import jwt from 'jsonwebtoken';

export function getCart(req, res) {
    try {
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
                return res.redirect('/create');
            }
        }

        return res.render('index', {
            showFooter: true,
            element: 'cart/cart',
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
