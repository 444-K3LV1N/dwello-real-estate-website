import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/authRoutes.js'
import propertyRoutes from './routes/propertyRoutes.js'
import favoriteRoutes from './routes/favoriteRoutes.js'
import inquiryRoutes from './routes/inquiryRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

import { errorHandler, notFound } from './middleware/error.js'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required.')
}

const app = express()

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  : ['http://localhost:5175']

app.use(helmet())

app.use(
  cors({
    origin: allowedOrigins
  })
)

app.use(express.json({ limit: '1mb' }))

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false
  })
)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(notFound)
app.use(errorHandler)

export default app