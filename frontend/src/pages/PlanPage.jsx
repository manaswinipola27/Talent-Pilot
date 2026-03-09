import { useState } from 'react'
import { generatePlan } from '../api/client'
import toast from 'react-hot-toast'
import { Map, BookOpen, Code2, Trophy, ChevronRight } from 'lucide-react'

export default function PlanPage() {
    const [role, setRole] = useState('')
    const [plan, setPlan] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleGenerate = async () => {
        if (!role.trim()) { toast.error('Please enter a target role.'); return }
        setLoading(true)
        try {
            const { data } = await generatePlan({ target_role: role })
            setPlan(data.plan)
            toast.success('Your 8-week plan is ready!')
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to generate plan. Upload resume first.')
        } finally { setLoading(false) }
    }

    return (
        <div className="fade-up">
            <div className="section-header">
                <h2>Personalised Upskilling Planner</h2>
                <p>Generate a custom 8-week learning roadmap tailored to your skill gaps</p>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.875rem', color: 'var(--clr-muted)', display: 'block', marginBottom: 6 }}>Target Role</label>
                        <input className="input" placeholder="e.g. Full Stack Developer, Data Scientist…"
                            value={role} onChange={e => setRole(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleGenerate} disabled={loading} style={{ height: 46 }}>
                        {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <><Map size={16} /> Generate Plan</>}
                    </button>
                </div>
            </div>

            {plan && (
                <div>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Trophy size={20} color="var(--clr-warning)" />
                        <h3 style={{ color: 'var(--clr-text)' }}>8-Week Roadmap for <span style={{ color: 'var(--clr-accent)' }}>{plan.role}</span></h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {(plan.weeks || []).map((week) => (
                            <div key={week.week} className="card" style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{ minWidth: 48, height: 48, background: 'var(--grad-primary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>W{week.week}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ color: 'var(--clr-text)', marginBottom: '0.75rem' }}>{week.focus}</h3>
                                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--clr-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <BookOpen size={12} /> COURSES
                                            </p>
                                            {(week.courses || []).map((c, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', color: 'var(--clr-text)', marginBottom: 4 }}>
                                                    <ChevronRight size={12} color="var(--clr-primary)" /> {c}
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--clr-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Code2 size={12} /> PROJECT
                                            </p>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--clr-text)' }}>{week.project}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
