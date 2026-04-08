import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './context/AuthContext'

import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'

import HomePage from './pages/HomePage'
import DonorDashboardPage from './pages/DonorDashboardPage'
import LoginPage from './pages/LoginPage'
import PrivacyPage from './pages/PrivacyPage'
import RegisterPage from './pages/RegisterPage'
import LogoutPage from './pages/LogoutPage'
import DonatePage from './pages/DonatePage'

import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import DonorsContributionsPage from './pages/admin/DonorsContributionsPage'
import CaseloadPage from './pages/admin/CaseloadPage'
import ProcessRecordingPage from './pages/admin/ProcessRecordingPage'
import HomeVisitationPage from './pages/admin/HomeVisitationPage'
import ReportsPage from './pages/admin/ReportsPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'impact', element: <DonorDashboardPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'logout', element: <LogoutPage /> },
      { path: 'donate', element: <DonatePage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'donors', element: <DonorsContributionsPage /> },
      { path: 'caseload', element: <CaseloadPage /> },
      { path: 'process-recording', element: <ProcessRecordingPage /> },
      { path: 'home-visitation', element: <HomeVisitationPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'logout', element: <LogoutPage /> }
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
