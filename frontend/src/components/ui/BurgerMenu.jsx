import { ArrowBigDown, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'

export default function BurgerMenu({ appRoutes }) {
	const [menu, setMenu] = useState(false)

	useEffect(() => {
		document.body.style.overflowY = menu ? 'hidden' : 'auto'
	}, [menu])

	return (
		<>
			<button onClick={() => setMenu(!menu)} className='md:hidden z-10'>
				{menu ? (
					<X strokeWidth={'0.125rem'} />
				) : (
					<Menu strokeWidth={'0.125rem'} />
				)}
			</button>

			{menu &&
				createPortal(
					<section className='fixed top-12 left-0 w-screen h-[calc(100vh-3rem)] bg-white md:hidden'>
						<ul>
							{appRoutes.map(({ path, label }) => (
								<li key={label} className='flex' onClick={() => setMenu(false)}>
									<Link
										to={path}
										className='py-2 px-[2.5vw] border-b-1 border-black/20 w-full flex items-center justify-between'
									>
										<p>{label}</p>
										<ArrowBigDown strokeWidth={'0.075rem'} />
									</Link>
								</li>
							))}
						</ul>
					</section>,
					document.body
				)}
		</>
	)
}
