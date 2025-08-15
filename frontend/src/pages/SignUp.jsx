import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignUp() {
	const { user, signup } = useAuth()
	const nav = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [err, setErr] = useState('')

	if (user) return <Navigate to='/' replace />

	const submit = async e => {
		e.preventDefault()
		try {
			await signup(email, password)
			nav('/')
		} catch (e) {
			setErr('Sign up failed')
		}
	}

	return (
		<form
			onSubmit={submit}
			className='max-w-sm mx-auto mt-24 flex flex-col gap-3'
		>
			<h1 className='text-xl font-bold'>Sign Up</h1>
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
			<button className='border rounded px-3 py-1'>Create account</button>
			<p>
				Have an account?{' '}
				<Link to='/login' className='underline'>
					Log in
				</Link>
			</p>
		</form>
	)
}
