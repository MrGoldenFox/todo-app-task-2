const BASE = 'http://localhost:4000/api'

export async function api(path, options = {}) {
	const res = await fetch(BASE + path, {
		credentials: 'include',
		headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
		...options,
	})
	if (!res.ok) throw new Error(await res.text().catch(() => res.statusText))
	return res.status === 204 ? null : res.json()
}
