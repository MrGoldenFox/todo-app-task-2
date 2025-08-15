import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/containers/Header'
import PrivateRoute from './components/ui/PrivateRoute'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import NewTask from './pages/NewTask'
import SignUp from './pages/SignUp'

export default function App() {
	const appRoutes = [
		{ path: '/', element: <Home />, label: 'Tasks', private: true },
		{
			path: '/create-task',
			element: <NewTask />,
			label: 'New Task',
			private: true,
		},
		{ path: '/login', element: <Login />, label: 'Login', hideWhenAuth: true },
		{
			path: '/signup',
			element: <SignUp />,
			label: 'Sign Up',
			hideWhenAuth: true,
		},
	]

	return (
		<AuthProvider>
			<BrowserRouter>
				<Header appRoutes={appRoutes} />
				<main className='pt-16 px-[2.5vw] pb-4'>
					<Routes>
						{appRoutes.map(({ path, element, private: isPrivate }) => (
							<Route
								key={path}
								path={path}
								element={
									isPrivate ? <PrivateRoute>{element}</PrivateRoute> : element
								}
							/>
						))}
					</Routes>
				</main>
			</BrowserRouter>
		</AuthProvider>
	)
}
