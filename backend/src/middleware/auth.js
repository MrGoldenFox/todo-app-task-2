import jwt from 'jsonwebtoken'

const isProd = process.env.NODE_ENV === 'production'

export const cookieOpts = {
	httpOnly: true,
	sameSite: 'lax',
	secure: isProd,
	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

export function issueToken(res, payload) {
	const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
	res.cookie('token', token, cookieOpts)
	return token
}

export function requireAuth(req, res, next) {
	const bearer = req.headers.authorization?.startsWith('Bearer ')
		? req.headers.authorization.slice(7)
		: null

	const token = req.cookies?.token || bearer
	if (!token) return res.status(401).json({ message: 'Missing token' })

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET)
		req.user = { id: payload.sub, email: payload.email }
		next()
	} catch {
		return res.status(401).json({ message: 'Invalid or expired token' })
	}
}
