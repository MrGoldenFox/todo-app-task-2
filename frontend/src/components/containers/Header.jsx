import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import BurgerMenu from '../ui/BurgerMenu'
import logo from '/img/react.svg'

export default function Header({ appRoutes }) {
	const { user, logout } = useAuth()

	const visibleRoutes = appRoutes.filter(r => {
		if (r.hideWhenAuth && user) return false
		if (r.private && !user) return false
		return true
	})

	return (
		<header className='fixed top-0 left-0 right-0 z-50 h-12 bg-bg border-b border-black/10'>
			<div className='h-full px-[2.5vw] flex items-center gap-4'>
				<Link to='/' className='flex items-center gap-2'>
					<img src={logo} alt='logo' className='h-7' />
					<span className='hidden sm:block font-semibold'>LOGO</span>
				</Link>

				<nav className='hidden md:flex items-center gap-1'>
					{visibleRoutes.map(({ path, label }) => (
						<NavLink
							key={path}
							to={path}
							end={path === '/'}
							className={({ isActive }) =>
								`px-3 py-1 rounded-md transition ${
									isActive ? 'bg-black text-white' : 'hover:bg-black/5'
								}`
							}
						>
							{label}
						</NavLink>
					))}
				</nav>

				<div className='ml-auto flex items-center gap-3'>
					{user && (
						<>
							<span className='hidden sm:block text-sm opacity-70'>
								{user.email}
							</span>
							<button
								onClick={logout}
								className='px-3 py-1 rounded-md border hover:bg-black/5'
							>
								Logout
							</button>
						</>
					)}

					<BurgerMenu appRoutes={visibleRoutes} />
				</div>
			</div>
		</header>
	)
}
