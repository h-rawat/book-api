function validateRegister(req, res, next) {
    const { username, password } = req.body
    const errors = []

    if (!username) {
        errors.push('Username is required')
    }
    else if (!/\S+@\S+\.\S+/.test(username)) {
        errors.push('Username must be a valid email')
    }

    if (!password) {
        errors.push('Password is required')
    }
    else if (password.length < 6) {
        errors.push('Password must be at least 6 characters')
    }

    if (errors.length) {
        return res.status(400).json({ errors })
    }

    next()
}

// Validate Login Data
function validateLogin(req, res, next) {
    const { username, password } = req.body;
    const errors = [];

    if (!username) errors.push('Username is required');
    if (!password) errors.push('Password is required');

    if (errors.length) return res.status(400).json({ errors });

    next();
}

// Validate Book Data (for create/update)
function validateBook(req, res, next) {
    const { title, author, publishedYear, genre } = req.body;
    const errors = [];

    if (!title) errors.push('Title is required');
    if (!author) errors.push('Author is required');
    if (publishedYear !== undefined &&
        (!Number.isInteger(publishedYear) || publishedYear < 0))
        errors.push('Published year must be a non-negative integer');
    if (genre !== undefined && typeof genre !== 'string')
        errors.push('Genre must be a string if provided');

    if (errors.length) return res.status(400).json({ errors });

    next();
}

module.exports = {
    validateRegister,
    validateLogin,
    validateBook
};