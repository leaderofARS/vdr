/**
 * @file csrf.js
 * CSRF middleware — disabled for stateless JWT API
 * csurf is incompatible with Express 5
 */
const csrfProtection = (req, res, next) => next();
module.exports = csrfProtection;