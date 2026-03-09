import { useState } from 'react'
import { generateQuiz, submitQuiz } from '../api/client'
import toast from 'react-hot-toast'
import { Brain, CheckCircle, XCircle, Trophy } from 'lucide-react'

export default function QuizPage() {
    const [topic, setTopic] = useState('')
    const [quiz, setQuiz] = useState(null)
    const [answers, setAnswers] = useState({})
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [quizId, setQuizId] = useState(null)

    const handleGenerate = async () => {
        if (!topic.trim()) { toast.error('Enter a topic.'); return }
        setLoading(true)
        try {
            const { data } = await generateQuiz({ topic, count: 10 })
            setQuiz(data.questions)
            setQuizId(data.quiz_id)
            setAnswers({})
            setResult(null)
        } catch (err) { toast.error('Failed to generate quiz.') }
        finally { setLoading(false) }
    }

    const handleSubmit = async () => {
        if (Object.keys(answers).length < quiz.length) { toast.error(`Answer all ${quiz.length} questions.`); return }
        setLoading(true)
        try {
            const { data } = await submitQuiz({ quiz_id: quizId, responses: answers })
            setResult(data)
            toast.success(`Quiz submitted! Score: ${data.score}%`)
        } catch (err) { toast.error('Submission failed.') }
        finally { setLoading(false) }
    }

    return (
        <div className="fade-up">
            <div className="section-header">
                <h2>Quiz Engine</h2>
                <p>Test your knowledge on any topic with AI-generated MCQs</p>
            </div>

            <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--clr-muted)', display: 'block', marginBottom: 6 }}>Topic</label>
                    <input className="input" placeholder="e.g. React Hooks, Machine Learning, System Design…"
                        value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleGenerate()} />
                </div>
                <button className="btn btn-primary" onClick={handleGenerate} disabled={loading} style={{ height: 46 }}>
                    {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <><Brain size={16} /> Generate Quiz</>}
                </button>
            </div>

            {quiz && !result && (
                <div>
                    {quiz.map((q, qi) => (
                        <div key={q.id} className="card" style={{ marginBottom: '1rem' }}>
                            <p style={{ color: 'var(--clr-text)', fontWeight: 500, marginBottom: '1rem' }}>
                                <span style={{ color: 'var(--clr-accent)', fontWeight: 700 }}>{qi + 1}.</span> {q.question}
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                {Object.entries(q.options).map(([key, val]) => (
                                    <button key={key} onClick={() => setAnswers(a => ({ ...a, [q.id]: key }))}
                                        className="btn"
                                        style={{
                                            justifyContent: 'flex-start', padding: '0.6rem 1rem', fontSize: '0.875rem',
                                            background: answers[q.id] === key ? 'var(--grad-primary)' : 'var(--clr-surface-2)',
                                            color: answers[q.id] === key ? '#fff' : 'var(--clr-text)',
                                            border: answers[q.id] === key ? 'none' : '1px solid var(--clr-border)',
                                        }}>
                                        <span style={{ fontWeight: 700, marginRight: 8 }}>{key}.</span> {val}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
                        {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : 'Submit Quiz →'}
                    </button>
                </div>
            )}

            {result && (
                <div className="fade-up">
                    <div className="card stat-card" style={{ marginBottom: '1.5rem' }}>
                        <Trophy size={32} color="var(--clr-warning)" style={{ margin: '0 auto 0.75rem' }} />
                        <div className="stat-value">{result.score}%</div>
                        <div className="stat-label">{result.correct} / {result.total} Correct</div>
                        <div className="progress-bar" style={{ marginTop: '1rem' }}><div className="progress-fill" style={{ width: `${result.score}%` }} /></div>
                        <button className="btn btn-outline" onClick={() => { setQuiz(null); setResult(null) }} style={{ marginTop: '1rem' }}>
                            Try Another Quiz
                        </button>
                    </div>

                    {(result.review || []).map((r, i) => (
                        <div key={i} className="card" style={{ marginBottom: '0.75rem', borderLeft: `4px solid ${r.is_correct ? 'var(--clr-success)' : 'var(--clr-danger)'}` }}>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                {r.is_correct
                                    ? <CheckCircle size={18} color="var(--clr-success)" style={{ flexShrink: 0, marginTop: 2 }} />
                                    : <XCircle size={18} color="var(--clr-danger)" style={{ flexShrink: 0, marginTop: 2 }} />
                                }
                                <div>
                                    <p style={{ color: 'var(--clr-text)', fontWeight: 500, marginBottom: '0.5rem' }}>{r.question}</p>
                                    <p style={{ fontSize: '0.825rem', marginBottom: '0.25rem' }}>
                                        Your answer: <strong style={{ color: r.is_correct ? 'var(--clr-success)' : 'var(--clr-danger)' }}>{r.your_answer}</strong>
                                        {!r.is_correct && <> · Correct: <strong style={{ color: 'var(--clr-success)' }}>{r.correct_answer}</strong></>}
                                    </p>
                                    {r.explanation && <p style={{ fontSize: '0.8rem', color: 'var(--clr-muted)' }}>💡 {r.explanation}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
