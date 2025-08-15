import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import mongoose from 'mongoose'

import authRoutes from './routes/auth.routes.js'
import todoRoutes from './routes/todo.routes.js'

const app = express()

// security & essentials
app.use(helmet())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }))
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())

// health
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// routes
app.use('/api/auth', authRoutes)
app.use('/api/todos', todoRoutes)

// 404
app.use((_req, res) => res.status(404).json({ message: 'Not found' }))

// start
const { MONGO_URL, PORT = 4000 } = process.env
if (!MONGO_URL) {
	console.error('✖ Missing MONGO_URL in .env')
	process.exit(1)
}

await mongoose
	.connect(MONGO_URL, { serverSelectionTimeoutMS: 8000 })
	.then(() => console.log('✓ Mongo connected'))
	.catch(err => {
		console.error('✖ Mongo connect failed:', err.message)
		process.exit(1)
	})

app.listen(PORT, () => console.log(`API → http://localhost:${PORT}`))
