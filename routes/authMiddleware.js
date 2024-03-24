exports.isAuthenticated = (req, res, next) => {
    console.log("isAuthenticated middleware called");
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403).send('Access Denied: you need to be a user.Member');
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.Role === 'Admin') {
        return next();
    }
    res.status(403).send('Access Denied: you need to be user.Admin');
}