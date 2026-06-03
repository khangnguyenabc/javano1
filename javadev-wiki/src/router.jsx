import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import CategoryListPage from './pages/CategoryListPage'
import CategoryDetailPage from './pages/CategoryDetailPage'
import SearchPage from './pages/SearchPage'
import RoadmapPage from './pages/RoadmapPage'
import NotFoundPage from './pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'topics', element: <CategoryListPage /> },
      { path: 'topics/:slug', element: <CategoryDetailPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'roadmap', element: <RoadmapPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default router
