export function logoutAction(req, res) {
    try {
        res.clearCookie('token');
        return res.redirect('/auth');
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
