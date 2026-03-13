import { Link } from 'react-router-dom'
import { Zap, ArrowRight, Brain, Mic, FileText, BarChart3, BookOpen, Sparkles } from 'lucide-react'

const features = [
    { icon: FileText, title: 'Resume Intelligence', desc: 'AI-powered resume parsing, skill extraction, and gap analysis.' },
    { icon: Brain, title: 'Personalised Upskilling', desc: 'Custom 8-week learning plans with curated courses and project ideas.' },
    { icon: Mic, title: 'AI Interview Coach', desc: 'Practice with AI-generated questions. Get scored on accuracy, confidence & structure.' },
    { icon: BookOpen, title: 'Dynamic Resources', desc: 'Fetches YouTube tutorials, Google articles, and Pexels visuals for every skill gap.' },
    { icon: BarChart3, title: 'Career Dashboard', desc: 'Real-time analytics visualising quiz scores, interview history, and readiness.' },
    { icon: Sparkles, title: 'Job Recommendations', desc: 'AI-curated job matches aligned to your skills and career aspirations.' },
]

export default function LandingPage() {
    return (
        <div style={{ minHeight: '100vh' }}>
            {/* Nav */}
            <nav style={{ position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)', backgroundColor: 'rgba(3, 7, 18, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid var(--clr-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}><Zap size={16} color="#fff" /></div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>Talent Pilot</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/login" className="btn btn-ghost" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Log in</Link>
                    <Link to="/register" className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Get Started</Link>
                </div>
            </nav>

            {/* Hero */}
            <section style={{ textAlign: 'center', padding: '8rem 2rem 6rem', position: 'relative' }}>
                <div style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '99px', border: '1px solid var(--clr-border)', background: 'rgba(255,255,255,0.03)', fontSize: '0.85rem', color: 'var(--clr-text)', backdropFilter: 'blur(4px)' }}>
                    <Sparkles size={14} color="var(--clr-primary)" /> Powered by Intelligent Agents + Real-time APIs
                </div>
                <h1 style={{ marginBottom: '1.5rem' }}>
                    The Career Platform Your <br/>
                    <span style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Future Deserves.</span>
                </h1>
                <p style={{ fontSize: '1.15rem', lineHeight: 1.6, maxWidth: 650, margin: '0 auto 2.5rem', color: 'var(--clr-muted)' }}>
                    Stop playing the guessing game. Talent Pilot lives alongside your career journey, autonomously finding skill gaps, building learning plans, and writing interview feedback real-time.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/register" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}>Test Platform</Link>
                    <Link to="/login" className="btn btn-outline" style={{ fontSize: '1rem', padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--clr-border)', color: 'var(--clr-text)' }}>View Features <ArrowRight size={16} /></Link>
                </div>

                {/* Glow orbs */}
                <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, background: 'radial-gradient(circle,rgba(59,130,246,0.15),transparent)', borderRadius: '50%', filter: 'blur(60px)', zIndex: -1 }} />
                <div style={{ position: 'absolute', top: '30%', right: '10%', width: 200, height: 200, background: 'radial-gradient(circle,rgba(6,182,212,0.1),transparent)', borderRadius: '50%', filter: 'blur(60px)', zIndex: -1 }} />
            </section>

            {/* Features */}
            <section style={{ padding: '4rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.75rem' }}>Everything you need to succeed.</h2>
                <p style={{ textAlign: 'center', marginBottom: '4rem', fontSize: '1.1rem' }}>Six intelligent modules working together for your career growth.</p>
                <div className="grid-3">
                    {features.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="card">
                            <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <Icon size={20} color="var(--clr-text)" />
                            </div>
                            <h3 style={{ color: 'var(--clr-text)', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>{title}</h3>
                            <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ textAlign: 'center', padding: '6rem 2rem', background: 'rgba(255,255,255,0.02)', margin: '4rem 2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--clr-border)', backdropFilter: 'blur(10px)' }}>
                <h2 style={{ marginBottom: '1rem' }}>Ready to accelerate with zero debt?</h2>
                <p style={{ marginBottom: '2.5rem', fontSize: '1.1rem' }}>Join leading teams standardizing their career development with Talent Pilot AI.</p>
                <Link to="/register" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
                    Try the Sandbox
                </Link>
            </section>

            {/* Footer */}
            <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem 3rem', color: 'var(--clr-muted)', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div>© {new Date().getFullYear()} Talent Pilot. All rights reserved.</div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <Link to="#" style={{ color: 'var(--clr-muted)', textDecoration: 'none' }}>Privacy Policy</Link>
                    <Link to="#" style={{ color: 'var(--clr-muted)', textDecoration: 'none' }}>Terms of Service</Link>
                </div>
            </footer>
        </div>
    )
}
