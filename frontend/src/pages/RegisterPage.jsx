import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { register as apiRegister } from '../api/client'
import toast from 'react-hot-toast'
import { Zap, Mail, Lock, User, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.password.length < 8) { toast.error('Password must be at least 8 characters.'); return }
        setLoading(true)
        try {
            const { data } = await apiRegister(form)
            login(data.access_token, data.user)
            toast.success(`Welcome to VidyāMitra, ${data.user.name}! 🎉`)
            navigate('/dashboard')
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Registration failed.')
        } finally {
            setLoading(false)
        }
    }

    const field = (key, label, type, Icon, placeholder) => (
        <div>
            <label style={{ fontSize: '0.875rem', color: 'var(--clr-muted)', display: 'block', marginBottom: 6 }}>{label}</label>
            <div style={{ position: 'relative' }}>
                <Icon size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-muted)' }} />
                <input className="input" type={type} required placeholder={placeholder}
                    style={{ paddingLeft: 38 }} value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                />
            </div>
        </div>
    )

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="card" style={{ width: '100%', maxWidth: 420, animation: 'fadeUp 0.4s ease' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: 52, height: 52, background: 'var(--grad-primary)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: 'var(--shadow-glow)' }}>
                        <Zap size={24} color="#fff" />
                    </div>
                    <h2 style={{ color: 'var(--clr-text)' }}>Create Account</h2>
                    <p style={{ marginTop: 4 }}>Start your career transformation journey</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {field('name', 'Full Name', 'text', User, 'Your full name')}
                    {field('email', 'Email', 'email', Mail, 'you@example.com')}
                    {field('password', 'Password', 'password', Lock, 'Min. 8 characters')}
                    <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
                        {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <><ArrowRight size={16} /> Create Account</>}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>Sign in</Link>
                </p>
            </div>
        </div>
    )
}
