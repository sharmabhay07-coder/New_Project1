import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Search, Loader2, ChevronRight } from 'lucide-react'
import { getTasks, submitTask } from '@/lib/api/taskApi'
import useAuth from '@/hooks/useAuth'
import DashboardMiniProfile from '@/pages/dashboard/components/dashboard-mini-profile'
import PlansPromoPanel from '@/pages/dashboard/components/plans-promo-panel'
import './TasksPage.css'

const CATEGORIES = ['All', 'Signup', 'App', 'Survey', 'Website', 'Social']

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState({})
  const [formData, setFormData] = useState({})
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const { token } = useAuth()

  const fetchTasks = () => {
    setLoading(true)
    getTasks(token)
      .then(res => setTasks(res.data?.tasks || []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!token) { setLoading(false); return }
    fetchTasks()
  }, [token])

  const handleStart = async (taskId, taskLink) => {
    try {
      setSubmitting(s => ({ ...s, [taskId]: 'starting' }))
      const { startTask } = await import('@/lib/api/taskApi')
      const res = await startTask(token, taskId)
      
      if (taskLink) window.open(taskLink, '_blank')
      setSubmitting(s => ({ ...s, [taskId]: 'started' }))
      setFormData(s => ({ 
        ...s, 
        [taskId]: { 
          proofFile: null, 
          submissionNote: '',
          verificationCode: res.data.verificationCode,
          codeExpiresAt: res.data.codeExpiresAt,
          inputCode: ''
        } 
      }))
    } catch (err) {
      alert(err.message || 'Failed to start task')
      setSubmitting(s => ({ ...s, [taskId]: null }))
    }
  }

  const handleSubmitProof = async (taskId) => {
    try {
      const { proofFile, submissionNote, inputCode } = formData[taskId] || {}
      if (!proofFile) {
        alert('Proof Image File is required')
        return
      }
      if (!inputCode) {
        alert('Verification Code is required')
        return
      }
      
      setSubmitting(s => ({ ...s, [taskId]: 'submitting' }))
      await submitTask(token, taskId, proofFile, submissionNote, inputCode)
      
      setSubmitting(s => ({ ...s, [taskId]: 'completed' }))
      alert('Proof submitted successfully. Waiting for admin approval.')
      
      fetchTasks()
    } catch (err) {
      alert(err.message || 'Failed to submit')
      setSubmitting(s => ({ ...s, [taskId]: 'started' }))
    }
  }

  const getCategoryColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'app': return '🟣'
      case 'signup': return '🔵'
      case 'survey': return '🟢'
      case 'social': return '🟠'
      case 'website': return '🟡'
      default: return '🟣'
    }
  }

  const filteredTasks = tasks.filter(t => {
    const matchesCat = activeCategory === 'All' || t.taskType?.toLowerCase() === activeCategory.toLowerCase()
    const matchesSearch = (t.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                          (t.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="tasks-page-grid">
      <div className="tasks-col-fixed">
        <DashboardMiniProfile />
      </div>

      <div className="tasks-col-scroll dash-page">
        {/* ── HEADER ── */}
        <div className="dash-flex dash-items-center dash-justify-between dash-mb-6">
          <h1 className="dash-text-2xl dash-font-bold dash-text-foreground">Tasks</h1>
          <button 
            onClick={fetchTasks}
            className="dash-flex dash-items-center dash-gap-2 dash-text-sm dash-font-medium dash-text-muted-foreground dash-hover:text-foreground"
          >
            <RefreshCw className={`dash-size-4 ${loading ? 'dash-animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* ── SEARCH & SORT ── */}
        <div className="dash-card dash-p-2 dash-mb-6 dash-flex dash-items-center dash-gap-2 dash-shadow-soft">
          <div className="dash-flex-1 dash-flex dash-items-center dash-gap-2 dash-px-3">
            <Search className="dash-size-4 dash-text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="dash-w-full dash-bg-transparent dash-border-none dash-outline-none dash-text-sm"
            />
          </div>
          <div className="dash-h-6 dash-w-px dash-bg-border" />
          <select className="dash-bg-transparent dash-border-none dash-outline-none dash-text-sm dash-font-medium dash-text-muted-foreground dash-px-3 dash-py-2 dash-cursor-pointer">
            <option>Sort ▾</option>
            <option>Newest</option>
            <option>Highest Reward</option>
          </select>
        </div>

        {/* ── CATEGORIES ── */}
        <div className="dash-mb-6">
          <h3 className="dash-text-sm dash-font-bold dash-text-muted-foreground dash-mb-3 uppercase">Categories / Actions</h3>
          <div className="dash-flex dash-flex-wrap dash-gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`dash-px-4 dash-py-1.5 dash-rounded-full dash-text-sm dash-font-medium dash-transition-colors ${
                  activeCategory === cat 
                    ? 'dash-bg-primary dash-text-primary-foreground' 
                    : 'dash-bg-muted/50 dash-text-muted-foreground dash-hover:bg-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── TASK LIST ── */}
          {loading ? (
            <div className="dash-flex dash-items-center dash-justify-center dash-py-12">
              <Loader2 className="dash-size-8 dash-animate-spin dash-text-primary" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="dash-card dash-p-8 dash-text-center dash-text-muted-foreground">
              No tasks found. Try adjusting your filters.
            </div>
          ) : (
          <div className="dash-flex dash-flex-col dash-gap-4">
            {filteredTasks.map((task, i) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="dash-card dash-p-5 dash-shadow-soft dash-border dash-border-border dash-transition-all dash-hover:shadow-md"
              >
                <div className="dash-flex dash-flex-col md:dash-flex-row dash-gap-4 dash-justify-between">
                  
                  {/* Task Info */}
                  <div className="dash-flex-1">
                    <h3 className="dash-text-lg dash-font-bold dash-text-foreground dash-flex dash-items-center dash-gap-2">
                      <span>{getCategoryColor(task.taskType)}</span> {task.title}
                    </h3>
                    
                    <p className="dash-mt-2 dash-text-sm dash-text-muted-foreground dash-leading-relaxed">
                      {task.description}
                    </p>

                    <div className="dash-mt-4 dash-flex dash-items-center dash-gap-6 dash-text-xs dash-font-medium dash-text-muted-foreground">
                      <span className="dash-flex dash-items-center dash-gap-1">⏱ 5 min</span>
                      <span className="dash-flex dash-items-center dash-gap-1">👥 1 available</span>
                      {task.taskType?.toLowerCase() === 'survey' && <span className="dash-flex dash-items-center dash-gap-1">⭐ Easy</span>}
                    </div>
                    
                    {/* Submission Form */}
                    {submitting[task._id] === 'started' && (
                      <div className="dash-mt-5 dash-rounded-xl dash-bg-muted/30 dash-p-4 dash-border dash-border-border">
                        <div className="dash-mb-4 dash-p-3 dash-bg-warning/10 dash-rounded-lg dash-border dash-border-warning/20">
                          <p className="dash-text-sm dash-font-bold dash-text-warning dash-mb-1">Verification Code: {formData[task._id]?.verificationCode}</p>
                          <p className="dash-text-xs dash-text-warning/80">Please enter this code in the input below, and ensure it is visible in your screenshot if requested.</p>
                          {formData[task._id]?.codeExpiresAt && (
                            <p className="dash-text-xs dash-font-medium dash-mt-2 dash-text-warning">
                              Expires in: {Math.max(0, Math.floor((new Date(formData[task._id].codeExpiresAt) - Date.now()) / 1000 / 60))} mins
                            </p>
                          )}
                        </div>
                        <div className="dash-mb-3">
                          <label className="dash-block dash-text-xs dash-font-medium dash-text-muted-foreground dash-mb-1">Enter Verification Code *</label>
                          <input 
                            type="text" 
                            placeholder="EH-XXXXX"
                            className="dash-w-full dash-rounded-lg dash-border dash-border-border dash-bg-background dash-px-3 dash-py-2 dash-text-sm"
                            onChange={(e) => setFormData(s => ({ ...s, [task._id]: { ...s[task._id], inputCode: e.target.value } }))}
                          />
                        </div>
                        <div className="dash-mb-3">
                          <label className="dash-block dash-text-xs dash-font-medium dash-text-muted-foreground dash-mb-1">Proof Image File *</label>
                          <input 
                            type="file" 
                            accept="image/*"
                            className="dash-w-full dash-rounded-lg dash-border dash-border-border dash-bg-background dash-px-3 dash-py-2 dash-text-sm"
                            onChange={(e) => setFormData(s => ({ ...s, [task._id]: { ...s[task._id], proofFile: e.target.files[0] } }))}
                          />
                        </div>
                        <div className="dash-mb-4">
                          <label className="dash-block dash-text-xs dash-font-medium dash-text-muted-foreground dash-mb-1">Note (Optional)</label>
                          <textarea 
                            placeholder="Any details about your submission..."
                            className="dash-w-full dash-rounded-lg dash-border dash-border-border dash-bg-background dash-px-3 dash-py-2 dash-text-sm"
                            rows={2}
                            onChange={(e) => setFormData(s => ({ ...s, [task._id]: { ...s[task._id], submissionNote: e.target.value } }))}
                          />
                        </div>
                        <div className="dash-flex dash-justify-end dash-gap-2">
                          <button 
                            onClick={() => setSubmitting(s => ({ ...s, [task._id]: null }))}
                            className="dash-rounded-lg dash-px-4 dash-py-2 dash-text-sm dash-font-medium dash-text-muted-foreground dash-hover:bg-muted"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleSubmitProof(task._id)}
                            className="dash-rounded-lg dash-bg-primary dash-px-4 dash-py-2 dash-text-sm dash-font-bold dash-text-primary-foreground"
                          >
                            Submit Proof
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reward & Action */}
                  <div className="dash-flex dash-flex-row md:dash-flex-col dash-items-center md:dash-items-end dash-justify-between md:dash-justify-end dash-gap-3 dash-min-w-[120px]">
                    <span className="dash-text-base dash-font-bold dash-text-foreground dash-flex dash-items-center dash-gap-1">
                      🪙 +{task.reward} Coins
                    </span>
                    
                    {task.submissionStatus === 'approved' ? (
                      <div className="dash-flex dash-flex-col dash-items-end dash-gap-1">
                        <span className="dash-w-full dash-text-center dash-rounded-lg dash-bg-success/10 dash-px-4 dash-py-2 dash-text-sm dash-font-bold dash-text-success">
                          ✓ Accepted
                        </span>
                        <p className="dash-text-[11px] dash-text-success dash-font-medium">Congratulations! You earned +{task.reward} Coins</p>
                      </div>
                    ) : task.submissionStatus === 'rejected' ? (
                      <div className="dash-flex dash-flex-col dash-items-end dash-gap-1">
                        <span className="dash-w-full dash-text-center dash-rounded-lg dash-bg-destructive/10 dash-px-4 dash-py-2 dash-text-sm dash-font-bold dash-text-destructive">
                          ✗ Rejected
                        </span>
                        {task.reviewNote && <p className="dash-text-[11px] dash-text-destructive dash-max-w-[150px] dash-text-right dash-line-clamp-2" title={task.reviewNote}>{task.reviewNote}</p>}
                      </div>
                    ) : task.hasSubmitted && task.submissionStatus !== 'started' ? (
                      <span className="dash-w-full dash-text-center dash-rounded-lg dash-bg-warning/10 dash-px-4 dash-py-2 dash-text-sm dash-font-bold dash-text-warning">
                        ⏳ Pending
                      </span>
                    ) : submitting[task._id] === 'submitting' ? (
                      <span className="dash-w-full dash-text-center dash-flex dash-items-center dash-justify-center dash-gap-2 dash-rounded-lg dash-bg-warning/10 dash-px-4 dash-py-2 dash-text-sm dash-font-medium dash-text-warning">
                        <Loader2 className="dash-size-4 dash-animate-spin" /> Submitting
                      </span>
                    ) : submitting[task._id] === 'completed' ? (
                      <span className="dash-w-full dash-text-center dash-rounded-lg dash-bg-success/10 dash-px-4 dash-py-2 dash-text-sm dash-font-bold dash-text-success">
                        ✓ Submitted
                      </span>
                    ) : submitting[task._id] !== 'started' && (
                      <button
                        onClick={() => handleStart(task._id, task.taskLink)}
                        className="dash-group dash-flex dash-items-center dash-gap-1.5 dash-rounded-xl dash-bg-primary dash-px-5 dash-py-2 dash-text-[15px] dash-font-bold dash-text-primary-foreground dash-shadow-lg dash-shadow-primary/30 dash-transition-all dash-duration-300 dash-hover:shadow-xl dash-hover:shadow-primary/50 dash-hover:-translate-y-1 dash-hover:scale-105 dash-active:scale-95"
                      >
                        Start task <ChevronRight className="dash-size-[18px] dash-transition-transform dash-duration-300 dash-group-hover:translate-x-1" strokeWidth={2.5} />
                      </button>
                    )}
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="tasks-col-fixed">
        <PlansPromoPanel />
      </div>
    </div>
  )
}