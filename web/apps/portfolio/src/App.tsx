import { Main } from '@/pages/main'
import { Contact } from '@/pages/contact'
import {
	createBrowserRouter,
	Outlet,
	RouterProvider,
	ScrollRestoration,
} from 'react-router'
import { Toaster } from '@workspace/ui/components/sonner'
import { TooltipProvider } from '@workspace/ui/components/tooltip'

const Root = () => (
	<TooltipProvider>
		<Outlet />
		<ScrollRestoration />
		<Toaster />
	</TooltipProvider>
)

const router = createBrowserRouter([
	{
		element: <Root />,
		children: [
			{ path: '/', element: <Main /> },
			{ path: '/contact', element: <Contact /> },
			{ path: '*', element: <Main /> },
		],
	},
])

export function App() {
  return (
    <RouterProvider router={router} />
  )
}