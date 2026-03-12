import { Link } from 'react-router-dom'
import { Zap, ArrowRight, Brain, Mic, FileText, BarChart3, BookOpen, Sparkles } from 'lucide-react'

const features = [
    { icon: FileText, title: 'Resume Intelligence', desc: 'AI-powered resume parsing, skill extraction, and gap analysis using GPT-4.' },
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
            <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem', borderBottom: '1px solid var(--clr-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}><Zap size={18} color="#fff" /></div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>Talent Pilot</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/login" className="btn btn-ghost">Sign In</Link>
                    <Link to="/register" className="btn btn-primary">Get Started <ArrowRight size={16} /></Link>
                </div>
            </nav>

            {/* Hero */}
            <section style={{ textAlign: 'center', padding: '6rem 2rem 4rem', position: 'relative' }}>
                <div className="badge badge-primary" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
                    <Sparkles size={12} style={{ marginRight: 4 }} /> Powered by GPT-4 + Real-time APIs
                </div>
                <h1 style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1.5rem' }}>
                    Bridge Education<br />& Employability
                </h1>
                <p style={{ fontSize: '1.2rem', maxWidth: 600, margin: '0 auto 2.5rem', color: 'var(--clr-muted)' }}>
                    Talent Pilot is your intelligent career companion — parsing resumes, building personalised skill plans,
                    simulating interviews, and tracking your readiness to the job market.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/register" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>Start for Free <ArrowRight size={18} /></Link>
                    <Link to="/login" className="btn btn-outline" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>Sign In</Link>
                </div>

                {/* Glow orbs */}
                <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, background: 'radial-gradient(circle,rgba(99,102,241,0.15),transparent)', borderRadius: '50%', filter: 'blur(60px)', zIndex: -1 }} />
                <div style={{ position: 'absolute', top: '30%', right: '10%', width: 200, height: 200, background: 'radial-gradient(circle,rgba(34,211,238,0.1),transparent)', borderRadius: '50%', filter: 'blur(60px)', zIndex: -1 }} />
            </section>

            {/* Features */}
            <section style={{ padding: '4rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.75rem' }}>Everything You Need to Succeed</h2>
                <p style={{ textAlign: 'center', marginBottom: '3rem' }}>Six intelligent modules working together for your career growth</p>
                <div className="grid-3">
                    {features.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="card" style={{ cursor: 'default' }}>
                            <div style={{ width: 44, height: 44, background: 'var(--clr-primary-glow)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                <Icon size={20} color="var(--clr-accent)" />
                            </div>
                            <h3 style={{ color: 'var(--clr-text)', marginBottom: '0.5rem' }}>{title}</h3>
                            <p style={{ fontSize: '0.9rem' }}>{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ textAlign: 'center', padding: '4rem 2rem', background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(167,139,250,0.05))', margin: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--clr-border)' }}>
                <h2 style={{ marginBottom: '1rem' }}>Ready to Accelerate Your Career?</h2>
                <p style={{ marginBottom: '2rem' }}>Join thousands of students and professionals transforming their careers with AI guidance.</p>
                <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '0.9rem 2.5rem' }}>
                    Create Free Account <ArrowRight size={18} />
                </Link>
            </section>

            <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--clr-muted)', fontSize: '0.85rem', borderTop: '1px solid var(--clr-border)' }}>
                © {new Date().getFullYear()} Talent Pilot — Intelligent Career Agent. Built with ❤️ and GPT-4.
            </footer>
        </div>
    )
}
