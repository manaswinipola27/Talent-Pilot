import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    LayoutDashboard, FileText, Map, Mic, Brain,
    BookOpen, Briefcase, LogOut, Zap
} from 'lucide-react'

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/resume', icon: FileText, label: 'Resume AI' },
    { to: '/plan', icon: Map, label: 'Skill Plan' },
    { to: '/interview', icon: Mic, label: 'Interview' },
    { to: '/quiz', icon: Brain, label: 'Quiz' },
    { to: '/resources', icon: BookOpen, label: 'Resources' },
    { to: '/jobs', icon: Briefcase, label: 'Jobs' },
]

export default function Sidebar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div style={{ marginBottom: '2rem', padding: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'var(--grad-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 'var(--shadow-glow)',
                    }}>
                        <Zap size={18} color="#fff" />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--clr-text)' }}>
                            VidyāMitra
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--clr-muted)' }}>Career Agent</div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.65rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            color: isActive ? '#fff' : 'var(--clr-muted)',
                            background: isActive ? 'var(--grad-primary)' : 'transparent',
                            fontWeight: isActive ? 600 : 400,
                            fontSize: '0.875rem',
                            transition: 'all 0.2s',
                            boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                            textDecoration: 'none',
                        })}
                    >
                        <Icon size={17} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* User */}
            {user && (
                <div style={{ borderTop: '1px solid var(--clr-border)', paddingTop: '1rem', marginTop: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--clr-muted)', marginBottom: '0.5rem', padding: '0 0.5rem' }}>
                        Signed in as <strong style={{ color: 'var(--clr-text)' }}>{user.name}</strong>
                    </div>
                    <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={handleLogout}>
                        <LogOut size={15} /> Sign Out
                    </button>
                </div>
            )}
        </aside>
    )
}
