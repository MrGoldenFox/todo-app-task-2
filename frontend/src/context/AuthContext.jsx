import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [ready, setReady] = useState(false)

	useEffect(() => {
		api('/auth/me')
			.then(setUser)
			.catch(() => {})
			.finally(() => setReady(true))
	}, [])

	const login = async (email, password) =>
		setUser(
			await api('/auth/login', {
				method: 'POST',
				body: JSON.stringify({ email, password }),
			})
		)
	const signup = async (email, password) =>
		setUser(
			await api('/auth/signup', {
				method: 'POST',
				body: JSON.stringify({ email, password }),
			})
		)
	const logout = async () => {
		await api('/auth/logout', { method: 'POST' })
		setUser(null)
	}

	return (
		<Ctx.Provider value={{ user, ready, login, signup, logout }}>
			{children}
		</Ctx.Provider>
	)
}
