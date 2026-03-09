import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AuthProvider } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import ResumePage from './pages/ResumePage'
import PlanPage from './pages/PlanPage'
import InterviewPage from './pages/InterviewPage'
import QuizPage from './pages/QuizPage'
import ResourcesPage from './pages/ResourcesPage'
import JobsPage from './pages/JobsPage'

function PrivateRoute({ children }) {
    const { user } = useAuth()
    return user ? children : <Navigate to="/login" replace />
}

function AppLayout({ children }) {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">{children}</main>
        </div>
    )
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/dashboard" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
            <Route path="/resume" element={<PrivateRoute><AppLayout><ResumePage /></AppLayout></PrivateRoute>} />
            <Route path="/plan" element={<PrivateRoute><AppLayout><PlanPage /></AppLayout></PrivateRoute>} />
            <Route path="/interview" element={<PrivateRoute><AppLayout><InterviewPage /></AppLayout></PrivateRoute>} />
            <Route path="/quiz" element={<PrivateRoute><AppLayout><QuizPage /></AppLayout></PrivateRoute>} />
            <Route path="/resources" element={<PrivateRoute><AppLayout><ResourcesPage /></AppLayout></PrivateRoute>} />
            <Route path="/jobs" element={<PrivateRoute><AppLayout><JobsPage /></AppLayout></PrivateRoute>} />
        </Routes>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    )
}
