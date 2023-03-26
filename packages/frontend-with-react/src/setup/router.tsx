import { Navigate, createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/Home'
import PublicLayout from '../entry/PublicLayout'
import FilterPage from '../pages/FilterPage'

export const router = createBrowserRouter([
  {
    path: '',
    element: <PublicLayout />,

    children: [
      {
        path: '',
        element: <Navigate to="home" />,
      },
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: 'search',
        element: <FilterPage />,
      },
    ],
  },
])
