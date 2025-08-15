import bcrypt from 'bcrypt'
import { Router } from 'express'
import { cookieOpts, issueToken, requireAuth } from '../middleware/auth.js'
import User from '../models/User.js'

const r = Router()

// POST /api/auth/signup
r.post('/signup', async (req, res) => {
	const { email, password } = req.body
	if (!email || !password)
		return res.status(400).json({ message: 'Email & password required' })

	const exists = await User.findOne({ email })
	if (exists) return res.status(409).json({ message: 'Email already in use' })

	const passwordHash = await bcrypt.hash(password, 10)
	const user = await User.create({ email, passwordHash })

	issueToken(res, { sub: user._id, email: user.email })
	res.status(201).json({ id: user._id, email: user.email })
})

// POST /api/auth/login
r.post('/login', async (req, res) => {
	const { email, password } = req.body
	const user = await User.findOne({ email })
	if (!user) return res.status(401).json({ message: 'Invalid credentials' })

	const ok = await bcrypt.compare(password, user.passwordHash)
	if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

	issueToken(res, { sub: user._id, email: user.email })
	res.json({ id: user._id, email: user.email })
})

// POST /api/auth/logout
r.post('/logout', (req, res) => {
	res.clearCookie('token', cookieOpts)
	res.json({ ok: true })
})

// GET /api/auth/me (check session)
r.get('/me', requireAuth, (req, res) => {
	res.json({ id: req.user.id, email: req.user.email })
})

export default r
