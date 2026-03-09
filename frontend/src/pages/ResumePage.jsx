import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadResume, getResumeReport } from '../api/client'
import toast from 'react-hot-toast'
import { Upload, FileText, CheckCircle, AlertTriangle, Zap } from 'lucide-react'

export default function ResumePage() {
    const [report, setReport] = useState(null)
    const [uploading, setUploading] = useState(false)

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0]
        if (!file) return
        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        try {
            const { data } = await uploadResume(formData)
            setReport(data.analysis)
            toast.success('Resume parsed successfully!')
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to parse resume.')
        } finally { setUploading(false) }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, accept: { 'application/pdf': {}, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {} }, maxFiles: 1,
    })

    return (
        <div className="fade-up">
            <div className="section-header">
                <h2>Resume Intelligence</h2>
                <p>Upload your resume for AI-powered skill extraction and gap analysis</p>
            </div>

            {/* Dropzone */}
            <div {...getRootProps()} className="card" style={{
                textAlign: 'center', padding: '3rem', cursor: 'pointer',
                border: `2px dashed ${isDragActive ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                background: isDragActive ? 'var(--clr-primary-glow)' : 'var(--grad-card)',
                transition: 'all 0.2s',
            }}>
                <input {...getInputProps()} id="resume-upload" />
                {uploading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} />
                        <p style={{ color: 'var(--clr-text)' }}>GPT-4 is analysing your resume…</p>
                    </div>
                ) : (
                    <>
                        <div style={{ width: 60, height: 60, background: 'var(--clr-primary-glow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <Upload size={28} color="var(--clr-accent)" />
                        </div>
                        <h3 style={{ color: 'var(--clr-text)', marginBottom: '0.5rem' }}>{isDragActive ? 'Drop it here!' : 'Drop your resume here'}</h3>
                        <p>Supports PDF and DOCX — max 5MB</p>
                        <button className="btn btn-outline" style={{ marginTop: '1rem' }}>Browse File</button>
                    </>
                )}
            </div>

            {/* Report */}
            {report && (
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Summary & Score */}
                    <div className="grid-2">
                        <div className="card">
                            <h3 style={{ color: 'var(--clr-text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FileText size={18} color="var(--clr-accent)" /> Professional Summary
                            </h3>
                            <p style={{ color: 'var(--clr-text)', lineHeight: 1.7 }}>{report.summary}</p>
                        </div>
                        <div className="card stat-card">
                            <div className="stat-value">{report.readiness_score}%</div>
                            <div className="stat-label">Job Market Readiness</div>
                            <div className="progress-bar" style={{ marginTop: '1rem' }}>
                                <div className="progress-fill" style={{ width: `${report.readiness_score}%` }} />
                            </div>
                        </div>
                    </div>

                    {/* Skills & Gaps */}
                    <div className="grid-2">
                        <div className="card">
                            <h3 style={{ color: 'var(--clr-text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <CheckCircle size={18} color="var(--clr-success)" /> Identified Skills
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {(report.skills || []).map(s => <span key={s} className="skill-tag">{s}</span>)}
                            </div>
                        </div>
                        <div className="card">
                            <h3 style={{ color: 'var(--clr-text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <AlertTriangle size={18} color="var(--clr-warning)" /> Skill Gaps
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {(report.gaps || []).map(g => (
                                    <span key={g} style={{ display: 'inline-block', padding: '0.3rem 0.75rem', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', color: 'var(--clr-warning)', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 500, margin: '0.25rem' }}>{g}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
