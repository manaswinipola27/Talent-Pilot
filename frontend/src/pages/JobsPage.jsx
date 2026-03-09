import { useState } from 'react'
import { searchJobs } from '../api/client'
import toast from 'react-hot-toast'
import { Briefcase, MapPin, DollarSign, TrendingUp, Star } from 'lucide-react'

export default function JobsPage() {
    const [role, setRole] = useState('')
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(false)

    const handleSearch = async () => {
        if (!role.trim()) { toast.error('Enter a target role.'); return }
        setLoading(true)
        try {
            const { data } = await searchJobs(role)
            setJobs(data.jobs || [])
        } catch (err) { toast.error('Failed to fetch job recommendations.') }
        finally { setLoading(false) }
    }

    const scoreColor = (s) => s >= 80 ? 'var(--clr-success)' : s >= 60 ? 'var(--clr-warning)' : 'var(--clr-danger)'

    return (
        <div className="fade-up">
            <div className="section-header">
                <h2>AI Job Recommendations</h2>
                <p>Discover jobs that match your skills profile — powered by GPT-4 market intelligence</p>
            </div>

            <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--clr-muted)', display: 'block', marginBottom: 6 }}>Target Role</label>
                    <input className="input" placeholder="e.g. Data Engineer, UX Designer…"
                        value={role} onChange={e => setRole(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                </div>
                <button className="btn btn-primary" onClick={handleSearch} disabled={loading} style={{ height: 46 }}>
                    {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <><Briefcase size={16} /> Find Jobs</>}
                </button>
            </div>

            {jobs.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {jobs.map((job, i) => (
                        <div key={i} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ color: 'var(--clr-text)', marginBottom: '0.35rem' }}>{job.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--clr-accent)', fontWeight: 500, marginBottom: '0.5rem' }}>{job.company}</p>
                                    <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>{job.job_description}</p>
                                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.825rem', marginBottom: '0.75rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--clr-muted)' }}>
                                            <MapPin size={13} /> {job.location}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--clr-success)' }}>
                                            <DollarSign size={13} /> {job.salary_range}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {(job.required_skills || []).map(s => <span key={s} className="skill-tag">{s}</span>)}
                                    </div>
                                </div>

                                <div style={{ textAlign: 'center', minWidth: 80 }}>
                                    <div style={{ width: 64, height: 64, borderRadius: '50%', border: `3px solid ${scoreColor(job.match_score)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: scoreColor(job.match_score) }}>{job.match_score}%</span>
                                    </div>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--clr-muted)', marginTop: 6 }}>Match</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
