function noCache(req, res, next) {
    res.set('Cache-Control', 'no-store'); // ✅ Prevent browser cache
    next();
}
module.exports = noCache;
