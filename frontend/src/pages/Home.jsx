// src/pages/Home.jsx
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

export default function Home() {
	const [todos, setTodos] = useState([])
	const [loading, setLoading] = useState(true)
	const [err, setErr] = useState('')
	const [filter, setFilter] = useState('all') // all | active | completed

	const load = async () => {
		try {
			setLoading(true)
			setErr('')
			const data = await api('/todos')
			setTodos(data)
		} catch {
			setErr('Failed to load tasks. Are you logged in?')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		load()
	}, [])

	const toggle = async t => {
		const optimistic = todos.map(x =>
			x._id === t._id ? { ...x, completed: !x.completed } : x
		)
		setTodos(optimistic)
		try {
			await api(`/todos/${t._id}`, {
				method: 'PATCH',
				body: JSON.stringify({ completed: !t.completed }),
			})
		} catch {
			setTodos(todos) // revert
			setErr('Failed to update task')
		}
	}

	const remove = async t => {
		const prev = [...todos]
		setTodos(prev.filter(x => x._id !== t._id))
		try {
			await api(`/todos/${t._id}`, { method: 'DELETE' })
		} catch {
			setTodos(prev) // revert
			setErr('Failed to delete task')
		}
	}

	const filtered = useMemo(() => {
		if (filter === 'active') return todos.filter(t => !t.completed)
		if (filter === 'completed') return todos.filter(t => t.completed)
		return todos
	}, [todos, filter])

	return (
		<section className='space-y-4'>
			<div className='flex items-center gap-3'>
				<h1 className='text-xl font-bold'>Tasks</h1>
				<Link
					to='/create-task'
					className='px-3 py-1 rounded-md border hover:bg-black/5'
				>
					+ New Task
				</Link>
				<div className='ml-auto text-sm opacity-70'>
					{todos.length} total · {todos.filter(t => !t.completed).length} active
				</div>
			</div>

			<div className='flex gap-2'>
				{['all', 'active', 'completed'].map(f => (
					<button
						key={f}
						onClick={() => setFilter(f)}
						className={`px-3 py-1 rounded-md border ${
							filter === f ? 'bg-black text-white' : 'hover:bg-black/5'
						}`}
					>
						{f[0].toUpperCase() + f.slice(1)}
					</button>
				))}
				<button
					onClick={load}
					className='ml-auto px-3 py-1 rounded-md border hover:bg-black/5'
				>
					Refresh
				</button>
			</div>

			{err && <p className='text-red-600'>{err}</p>}
			{loading ? (
				<p>Loading…</p>
			) : filtered.length === 0 ? (
				<p className='opacity-70'>No tasks here yet.</p>
			) : (
				<ul className='divide-y'>
					{filtered.map(t => (
						<li key={t._id} className='flex items-center gap-3 py-2'>
							<input
								type='checkbox'
								checked={t.completed}
								onChange={() => toggle(t)}
								className='h-4 w-4'
							/>
							<span
								className={`flex-1 ${
									t.completed ? 'line-through opacity-60' : ''
								}`}
							>
								{t.text}
							</span>
							<button
								onClick={() => remove(t)}
								className='px-2 py-1 rounded-md border hover:bg-black/5'
							>
								Delete
							</button>
						</li>
					))}
				</ul>
			)}
		</section>
	)
}
