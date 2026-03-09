import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getProgressSummary, getProgressTimeline } from '../api/client'
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { TrendingUp, Brain, Mic, FileText, Calendar } from 'lucide-react'

export default function Dashboard() {
    const { user } = useAuth()
    const [summary, setSummary] = useState(null)
    const [timeline, setTimeline] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([getProgressSummary(), getProgressTimeline()])
            .then(([s, t]) => { setSummary(s.data); setTimeline(t.data.timeline) })
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const stats = summary ? [
        { label: 'Resume Readiness', value: summary.resume_readiness, icon: FileText, suffix: '%' },
        { label: 'Avg Quiz Score', value: summary.avg_quiz_score, icon: Brain, suffix: '%' },
        { label: 'Avg Interview Score', value: summary.avg_interview_score, icon: Mic, suffix: '%' },
        { label: 'Overall Readiness', value: summary.overall_readiness, icon: TrendingUp, suffix: '%' },
    ] : []

    const chartData = summary ? [
        { name: 'Resume', value: summary.resume_readiness, fill: '#6366f1' },
        { name: 'Quiz', value: summary.avg_quiz_score, fill: '#22d3ee' },
        { name: 'Interview', value: summary.avg_interview_score, fill: '#a78bfa' },
    ] : []

    return (
        <div className="fade-up">
            <div className="section-header">
                <h2>Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
                <p>Here's your career readiness overview</p>
            </div>

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />
                    ))}
                </div>
            ) : summary ? (
                <>
                    {/* Stat cards */}
                    <div className="grid-4" style={{ marginBottom: '2rem' }}>
                        {stats.map(({ label, value, icon: Icon, suffix }) => (
                            <div key={label} className="card stat-card">
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                                    <div style={{ width: 40, height: 40, background: 'var(--clr-primary-glow)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon size={18} color="var(--clr-accent)" />
                                    </div>
                                </div>
                                <div className="stat-value">{value}{suffix}</div>
                                <div className="stat-label">{label}</div>
                                <div className="progress-bar" style={{ marginTop: '0.75rem' }}>
                                    <div className="progress-fill" style={{ width: `${value}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts row */}
                    <div className="grid-2" style={{ marginBottom: '2rem' }}>
                        <div className="card">
                            <h3 style={{ color: 'var(--clr-text)', marginBottom: '1.25rem' }}>Readiness Breakdown</h3>
                            <ResponsiveContainer width="100%" height={220}>
                                <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={chartData} startAngle={90} endAngle={-270}>
                                    <RadialBar dataKey="value" background={{ fill: 'var(--clr-surface-2)' }} />
                                    <Tooltip formatter={(v) => [`${v}%`]} contentStyle={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 8 }} />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                                {chartData.map(d => (
                                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.fill }} />
                                        <span style={{ color: 'var(--clr-muted)' }}>{d.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card">
                            <h3 style={{ color: 'var(--clr-text)', marginBottom: '1.25rem' }}>Activity Summary</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--clr-surface-2)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                                    <span style={{ fontSize: '0.875rem' }}>Quizzes Completed</span>
                                    <span className="badge badge-primary">{summary.quizzes_taken}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--clr-surface-2)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                                    <span style={{ fontSize: '0.875rem' }}>Interview Sessions</span>
                                    <span className="badge badge-success">{summary.interviews_taken}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="card">
                        <h3 style={{ color: 'var(--clr-text)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Calendar size={18} color="var(--clr-accent)" /> Activity Timeline
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 300, overflowY: 'auto' }}>
                            {timeline.length === 0 && <p>No activity yet. Upload your resume to get started!</p>}
                            {timeline.map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '0.75rem', background: 'var(--clr-surface-2)', borderRadius: 'var(--radius-sm)' }}>
                                    <span className={`badge badge-${item.type === 'resume' ? 'primary' : item.type === 'quiz' ? 'success' : 'warning'}`} style={{ whiteSpace: 'nowrap' }}>
                                        {item.type}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ color: 'var(--clr-text)', fontSize: '0.875rem', margin: 0 }}>{item.detail}</p>
                                        <p style={{ fontSize: '0.75rem', marginTop: 2 }}>{new Date(item.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p>Upload your resume to start tracking your career readiness! 🚀</p>
                </div>
            )}
        </div>
    )
}
