const AppError = require('../errors/AppError')

const allowRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError('FORBIDDEN', 403))
        }
        next()
    }
}

module.exports = allowRoles
