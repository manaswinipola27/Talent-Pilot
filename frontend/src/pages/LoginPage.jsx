import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as apiLogin } from '../api/client'
import toast from 'react-hot-toast'
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await apiLogin(form)
            login(data.access_token, data.user)
            toast.success(`Welcome back, ${data.user.name}!`)
            navigate('/dashboard')
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Login failed. Check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="card" style={{ width: '100%', maxWidth: 420, animation: 'fadeUp 0.4s ease' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: 52, height: 52, background: 'var(--grad-primary)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: 'var(--shadow-glow)' }}>
                        <Zap size={24} color="#fff" />
                    </div>
                    <h2 style={{ color: 'var(--clr-text)' }}>Welcome back</h2>
                    <p style={{ marginTop: 4 }}>Sign in to your Talent Pilot account</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.875rem', color: 'var(--clr-muted)', display: 'block', marginBottom: 6 }}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-muted)' }} />
                            <input className="input" type="email" required placeholder="you@example.com"
                                style={{ paddingLeft: 38 }}
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.875rem', color: 'var(--clr-muted)', display: 'block', marginBottom: 6 }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-muted)' }} />
                            <input className="input" type="password" required placeholder="••••••••"
                                style={{ paddingLeft: 38 }}
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                            />
                        </div>
                    </div>
                    <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
                        {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <><ArrowRight size={16} /> Sign In</>}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>Create one</Link>
                </p>
            </div>
        </div>
    )
}
