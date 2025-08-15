import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import Todo from '../models/Todo.js'

const r = Router()
// everything below requires a logged-in user
r.use(requireAuth)

// GET /api/todos
r.get('/', async (req, res) => {
	const todos = await Todo.find({ user: req.user.id }).sort('-createdAt')
	res.json(todos)
})

// POST /api/todos
r.post('/', async (req, res) => {
	const { text } = req.body
	if (!text) return res.status(400).json({ message: 'text required' })
	const todo = await Todo.create({ user: req.user.id, text })
	res.status(201).json(todo)
})

// PATCH /api/todos/:id
r.patch('/:id', async (req, res) => {
	const { id } = req.params
	const { text, completed } = req.body
	const todo = await Todo.findOneAndUpdate(
		{ _id: id, user: req.user.id },
		{
			$set: {
				...(text != null && { text }),
				...(completed != null && { completed }),
			},
		},
		{ new: true }
	)
	if (!todo) return res.status(404).json({ message: 'Not found' })
	res.json(todo)
})

// DELETE /api/todos/:id
r.delete('/:id', async (req, res) => {
	const ok = await Todo.findOneAndDelete({
		_id: req.params.id,
		user: req.user.id,
	})
	if (!ok) return res.status(404).json({ message: 'Not found' })
	res.json({ ok: true })
})

export default r
