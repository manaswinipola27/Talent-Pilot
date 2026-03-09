import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
})

// Auto-attach JWT
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('vm_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// Auth
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)

// Resume
export const uploadResume = (formData) =>
    api.post('/resume/parse', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const getResumeReport = () => api.get('/resume/report')

// Plan
export const generatePlan = (data) => api.post('/plan/generate', data)
export const getCurrentPlan = () => api.get('/plan/current')

// Interview
export const startInterview = (data) => api.post('/interview/start', data)
export const evaluateAnswer = (data) => api.post('/interview/evaluate', data)
export const getInterviewHistory = () => api.get('/interview/history')

// Quiz
export const generateQuiz = (data) => api.post('/quiz/generate', data)
export const submitQuiz = (data) => api.post('/quiz/submit', data)
export const getQuizHistory = () => api.get('/quiz/history')

// Resources
export const getResources = (topic) => api.get('/evaluate/resources', { params: { topic } })
export const getNews = (category) => api.get('/evaluate/news', { params: { category } })
export const getMarket = (base) => api.get('/evaluate/market', { params: { base } })

// Jobs
export const searchJobs = (role) => api.get('/jobs/search', { params: { role } })

// Progress
export const getProgressSummary = () => api.get('/progress/summary')
export const getProgressTimeline = () => api.get('/progress/timeline')

export default api
