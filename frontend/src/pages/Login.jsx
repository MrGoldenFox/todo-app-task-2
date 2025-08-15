import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
	const { user, login } = useAuth()
	const nav = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [err, setErr] = useState('')

	if (user) return <Navigate to='/' replace />

	const submit = async e => {
		e.preventDefault()
		try {
			await login(email, password)
			nav('/')
		} catch (e) {
			setErr('Invalid email or password')
		}
	}

	return (
		<form
			onSubmit={submit}
			className='max-w-sm mx-auto mt-24 flex flex-col gap-3'
		>
			<h1 className='text-xl font-bold'>Login</h1>
			{err && <p className='text-red-600'>{err}</p>}
			<input
				value={email}
				onChange={e => setEmail(e.target.value)}
				placeholder='Email'
				className='p-1 rounded-md border-black/20'
			/>
			<input
				type='password'
				value={password}
				onChange={e => setPassword(e.target.value)}
				placeholder='Password'
				className='p-1 rounded-md border-black/20'
			/>
			<button className='border rounded px-3 py-1'>Login</button>
			<p>
				New here?{' '}
				<Link to='/signup' className='underline'>
					Sign up
				</Link>
			</p>
		</form>
	)
}
