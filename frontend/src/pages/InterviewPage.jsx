import { useState } from 'react'
import { startInterview, evaluateAnswer } from '../api/client'
import toast from 'react-hot-toast'
import { Mic, Send, Star, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'

const LEVELS = ['Junior', 'Mid', 'Senior']

export default function InterviewPage() {
    const [role, setRole] = useState('')
    const [level, setLevel] = useState('Mid')
    const [session, setSession] = useState(null)
    const [current, setCurrent] = useState(0)
    const [answer, setAnswer] = useState('')
    const [result, setResult] = useState(null)
    const [allResults, setAllResults] = useState([])
    const [loading, setLoading] = useState(false)

    const handleStart = async () => {
        if (!role.trim()) { toast.error('Enter a role to interview for.'); return }
        setLoading(true)
        try {
            const { data } = await startInterview({ role, level, count: 5 })
            setSession(data)
            setCurrent(0)
            setAnswer('')
            setResult(null)
            setAllResults([])
        } catch (err) { toast.error('Failed to start interview.') }
        finally { setLoading(false) }
    }

    const handleSubmit = async () => {
        if (!answer.trim()) { toast.error('Please type your answer.'); return }
        setLoading(true)
        try {
            const question = session.questions[current].question
            const { data } = await evaluateAnswer({ session_id: session.session_id, question, answer })
            setResult(data.evaluation)
            const newResults = [...allResults, { question, answer, evaluation: data.evaluation }]
            setAllResults(newResults)
        } catch (err) { toast.error('Evaluation failed.') }
        finally { setLoading(false) }
    }

    const handleNext = () => {
        if (current < session.questions.length - 1) {
            setCurrent(c => c + 1)
            setAnswer('')
            setResult(null)
        } else {
            toast.success('Interview complete! Check your results below.')
        }
    }

    const avgScore = allResults.length
        ? Math.round(allResults.reduce((s, r) => s + r.evaluation.score, 0) / allResults.length) : 0

    return (
        <div className="fade-up">
            <div className="section-header">
                <h2>AI Interview Simulator</h2>
                <p>Practice with AI-generated questions and receive instant GPT-4 feedback</p>
            </div>

            {/* Setup */}
            {!session && (
                <div className="card">
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <div style={{ flex: 2, minWidth: 200 }}>
                            <label style={{ fontSize: '0.875rem', color: 'var(--clr-muted)', display: 'block', marginBottom: 6 }}>Role</label>
                            <input className="input" placeholder="e.g. Backend Engineer" value={role} onChange={e => setRole(e.target.value)} />
                        </div>
                        <div style={{ flex: 1, minWidth: 140 }}>
                            <label style={{ fontSize: '0.875rem', color: 'var(--clr-muted)', display: 'block', marginBottom: 6 }}>Level</label>
                            <select className="input" value={level} onChange={e => setLevel(e.target.value)} style={{ cursor: 'pointer' }}>
                                {LEVELS.map(l => <option key={l}>{l}</option>)}
                            </select>
                        </div>
                        <button className="btn btn-primary" onClick={handleStart} disabled={loading} style={{ height: 46 }}>
                            {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <><Mic size={16} /> Start Interview</>}
                        </button>
                    </div>
                </div>
            )}

            {/* Active Interview */}
            {session && (
                <div>
                    {/* Progress */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <span className="badge badge-primary">Question {current + 1} / {session.questions.length}</span>
                        <div className="progress-bar" style={{ flex: 1 }}>
                            <div className="progress-fill" style={{ width: `${((current + 1) / session.questions.length) * 100}%` }} />
                        </div>
                        <button className="btn btn-ghost" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => { setSession(null); setAllResults([]) }}>
                            Reset
                        </button>
                    </div>

                    <div className="grid-2" style={{ alignItems: 'start' }}>
                        {/* Question */}
                        <div className="card">
                            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                                <span className="badge badge-warning" style={{ textTransform: 'capitalize' }}>
                                    {session.questions[current]?.type}
                                </span>
                            </div>
                            <h3 style={{ color: 'var(--clr-text)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                {session.questions[current]?.question}
                            </h3>
                            <textarea className="input" rows={6} placeholder="Type your answer here…"
                                value={answer} onChange={e => setAnswer(e.target.value)}
                                style={{ resize: 'vertical' }}
                            />
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !!result}>
                                    {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <><Send size={16} /> Submit</>}
                                </button>
                                {result && (
                                    <button className="btn btn-outline" onClick={handleNext}>
                                        {current < session.questions.length - 1 ? 'Next Question →' : 'Finish'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Result */}
                        <div>
                            {result ? (
                                <div className="card fade-up">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                        <h3 style={{ color: 'var(--clr-text)' }}>Feedback</h3>
                                        <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                            {result.score}/100
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                                        {[{ label: 'Accuracy', v: result.accuracy, max: 40 }, { label: 'Confidence', v: result.confidence, max: 30 }, { label: 'Structure', v: result.structure, max: 30 }].map(s => (
                                            <div key={s.label} style={{ flex: 1, minWidth: 80, background: 'var(--clr-surface-2)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--clr-accent)' }}>{s.v}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--clr-muted)' }}>{s.label}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--clr-muted)' }}>/{s.max}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--clr-success)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={12} /> STRENGTHS</p>
                                        {(result.strengths || []).map((s, i) => <p key={i} style={{ fontSize: '0.875rem', color: 'var(--clr-text)', marginBottom: 4 }}>• {s}</p>)}
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--clr-warning)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={12} /> IMPROVE</p>
                                        {(result.improvements || []).map((s, i) => <p key={i} style={{ fontSize: '0.875rem', color: 'var(--clr-text)', marginBottom: 4 }}>• {s}</p>)}
                                    </div>
                                    <div style={{ background: 'var(--clr-surface-2)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--clr-accent)', marginBottom: 6 }}>💡 MODEL ANSWER</p>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--clr-text)', lineHeight: 1.6 }}>{result.model_answer}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--clr-muted)' }}>
                                    <Mic size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                                    <p>Submit your answer to get AI feedback</p>
                                </div>
                            )}

                            {allResults.length > 0 && (
                                <div className="card" style={{ marginTop: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <Star size={16} color="var(--clr-warning)" />
                                        <span style={{ fontWeight: 600, color: 'var(--clr-text)', fontSize: '0.9rem' }}>Session Average: {avgScore}/100</span>
                                    </div>
                                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${avgScore}%` }} /></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
