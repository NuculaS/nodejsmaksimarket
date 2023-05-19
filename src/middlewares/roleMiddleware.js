import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default function (roles) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next();
        }

        const page = req.baseUrl.slice(1);

        try {
            const token = req.cookies.token;
            if (!token) {
                return res.redirect(`/auth?error=auth&page=${page}`);
            }

            const { roles: userRoles, id } = jwt.verify(
                token,
                process.env.SECRET
            );
            let hasRole = false;
            userRoles.forEach((role) => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
            });

            if (!hasRole) {
                return res.render('index', {
                    showFooter: false,
                    element: 'errors/error',
                    options: {
                        error: 'У вас нет доступа к этой странице',
                    },
                });
            }

            req.userId = id;

            next();
        } catch (e) {
            console.log(e);
            return res.redirect(`/auth?error=auth&page=${page}`);
        }
    };
}
