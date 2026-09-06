import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import prisma from '../utils/prisma.js'
import { serializeUser } from '../utils/serialize.js'

export const registerSchema = z.object({ name: z.string().trim().min(2).max(80), email: z.string().trim().email().transform((value) => value.toLowerCase()), password: z.string().min(8).max(100) })
export const loginSchema = z.object({ email: z.string().trim().email().transform((value) => value.toLowerCase()), password: z.string().min(1) })

function tokenFor(user) { return jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' }) }

export async function register(req, res, next) { try { const exists = await prisma.user.findUnique({ where: { email: req.body.email } }); if (exists) return res.status(409).json({ message: 'An account with this email already exists.' }); const password = await bcrypt.hash(req.body.password, 12); const user = await prisma.user.create({ data: { ...req.body, password } }); res.status(201).json({ user: serializeUser(user), token: tokenFor(user) }) } catch (error) { next(error) } }
export async function login(req, res, next) { try { const user = await prisma.user.findUnique({ where: { email: req.body.email } }); if (!user || !(await bcrypt.compare(req.body.password, user.password))) return res.status(401).json({ message: 'Invalid email or password.' }); res.json({ user: serializeUser(user), token: tokenFor(user) }) } catch (error) { next(error) } }
export function me(req, res) { res.json({ user: req.user }) }
