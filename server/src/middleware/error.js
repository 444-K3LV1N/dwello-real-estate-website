export function notFound(req, res) { res.status(404).json({ message: 'Route not found.' }) }
export function errorHandler(error, req, res, next) { console.error(error); if (res.headersSent) return next(error); res.status(error.statusCode || 500).json({ message: error.statusCode ? error.message : 'An unexpected server error occurred.' }) }
