/**
 *
 * @param req
 * @param res
 * @param next
 */
function base(req, res, next) {
    res.send('Hello from the backend')
} // end of base

module.exports = {
    base: base
}