// src/pages/NewTask.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function NewTask() {
	const [value, setValue] = useState('')
	const [loading, setLoading] = useState(false)
	const [err, setErr] = useState('')
	const nav = useNavigate()

	const onSubmit = async e => {
		e.preventDefault()
		const text = value.trim()
		if (!text) return
		try {
			setLoading(true)
			setErr('')
			await api('/todos', {
				method: 'POST',
				body: JSON.stringify({ text }),
			})
			setValue('')
			nav('/')
		} catch (e) {
			setErr('Failed to create task. Are you logged in?')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div>
			<h1 className='text-xl font-bold mb-3'>Create new task</h1>

			{err && <p className='mb-2 text-red-600'>{err}</p>}

			<form onSubmit={onSubmit} className='flex md:max-w-[50%]'>
				<input
					value={value}
					onChange={e => setValue(e.target.value)}
					placeholder='e.g., Finish MERN auth'
					className='border border-black/20 rounded-tl-md rounded-bl-md p-2 border-r-0 outline-0'
				/>
				<button
					type='submit'
					disabled={loading || !value.trim()}
					className='bg-accent px-4 py-1 rounded-tr-md rounded-br-md text-white disabled:opacity-50'
				>
					{loading ? 'Adding...' : 'Add'}
				</button>
			</form>
		</div>
	)
}
