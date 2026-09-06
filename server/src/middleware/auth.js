import jwt from 'jsonwebtoken'
import prisma from '../utils/prisma.js'
import { serializeUser } from '../utils/serialize.js'

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Authentication required.' })
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return res.status(401).json({ message: 'User account not found.' })
    req.user = serializeUser(user)
    next()
  } catch { res.status(401).json({ message: 'Invalid or expired token.' }) }
}

export function authorize(...roles) { return (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'You do not have permission for this action.' }) }
