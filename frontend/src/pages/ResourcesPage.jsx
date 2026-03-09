import { useState } from 'react'
import { getResources } from '../api/client'
import toast from 'react-hot-toast'
import { BookOpen, Youtube, Globe, Image } from 'lucide-react'

export default function ResourcesPage() {
    const [topic, setTopic] = useState('')
    const [resources, setResources] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleFetch = async () => {
        if (!topic.trim()) { toast.error('Enter a topic.'); return }
        setLoading(true)
        try {
            const { data } = await getResources(topic)
            setResources(data)
        } catch (err) { toast.error('Failed to fetch resources.') }
        finally { setLoading(false) }
    }

    return (
        <div className="fade-up">
            <div className="section-header">
                <h2>Dynamic Resource Fetcher</h2>
                <p>Fetches YouTube tutorials, articles, and visual aids for any skill topic</p>
            </div>

            <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--clr-muted)', display: 'block', marginBottom: 6 }}>Skill / Topic</label>
                    <input className="input" placeholder="e.g. Docker, TypeScript, Neural Networks…"
                        value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleFetch()} />
                </div>
                <button className="btn btn-primary" onClick={handleFetch} disabled={loading} style={{ height: 46 }}>
                    {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <><BookOpen size={16} /> Fetch Resources</>}
                </button>
            </div>

            {resources && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* YouTube */}
                    {resources.youtube?.length > 0 && (
                        <div>
                            <h3 style={{ color: 'var(--clr-text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Youtube size={18} color="#ff4444" /> YouTube Tutorials
                            </h3>
                            <div className="grid-3">
                                {resources.youtube.map((v, i) => (
                                    <a key={i} href={v.url} target="_blank" rel="noreferrer" className="card" style={{ textDecoration: 'none', padding: '0' }}>
                                        <img src={v.thumbnail} alt={v.title} style={{ width: '100%', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', display: 'block', objectFit: 'cover', height: 140 }} />
                                        <div style={{ padding: '1rem' }}>
                                            <p style={{ color: 'var(--clr-text)', fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.4, marginBottom: '0.35rem' }}>{v.title}</p>
                                            <p style={{ fontSize: '0.75rem' }}>{v.channel}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Articles */}
                    {resources.articles?.length > 0 && (
                        <div>
                            <h3 style={{ color: 'var(--clr-text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Globe size={18} color="var(--clr-secondary)" /> Articles & Courses
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {resources.articles.map((a, i) => (
                                    <a key={i} href={a.link} target="_blank" rel="noreferrer" className="card" style={{ textDecoration: 'none', display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem 1.25rem' }}>
                                        <Globe size={16} color="var(--clr-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
                                        <div>
                                            <p style={{ color: 'var(--clr-text)', fontWeight: 500, fontSize: '0.9rem', marginBottom: 4 }}>{a.title}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--clr-muted)' }}>{a.snippet}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Visuals */}
                    {resources.visuals?.length > 0 && (
                        <div>
                            <h3 style={{ color: 'var(--clr-text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Image size={18} color="var(--clr-accent)" /> Visual Learning Aids
                            </h3>
                            <div className="grid-3">
                                {resources.visuals.map((p, i) => (
                                    <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                        <img src={p.url} alt={p.alt} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
                                        <p style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: 'var(--clr-muted)' }}>📷 {p.photographer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
