import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { adminCreateTask } from '@/lib/api/taskApi'
import useAuth from '@/hooks/useAuth'

export default function AdminCreateTaskModal({ isOpen, onClose, onSuccess }) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    taskType: 'App', // App, Signup, Survey, Website, Social
    reward: 10,
    taskLink: '',
  })

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await adminCreateTask(token, {
        ...formData,
        reward: Number(formData.reward)
      })
      onSuccess()
      onClose()
      setFormData({
        title: '',
        description: '',
        taskType: 'App',
        reward: 10,
        taskLink: '',
      })
    } catch (err) {
      setError(err.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dash-fixed dash-inset-0 dash-z-50 dash-flex dash-items-center dash-justify-center dash-bg-black/50 dash-backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="dash-w-full dash-max-w-md dash-rounded-2xl dash-bg-background dash-p-6 dash-shadow-xl dash-border dash-border-border"
      >
        <div className="dash-flex dash-items-center dash-justify-between dash-mb-6">
          <h2 className="dash-text-lg dash-font-bold dash-text-foreground">Create New Task</h2>
          <button onClick={onClose} className="dash-rounded-full dash-p-1 dash-text-muted-foreground dash-hover:bg-muted dash-hover:text-foreground dash-transition-colors">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="dash-mb-4 dash-rounded-lg dash-bg-destructive/10 dash-p-3 dash-text-sm dash-text-destructive dash-border dash-border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="dash-space-y-4">
          <div>
            <label className="dash-block dash-text-xs dash-font-bold dash-text-muted-foreground dash-mb-1 uppercase">Task Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Install & Open App"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="dash-w-full dash-rounded-lg dash-border dash-border-border dash-bg-background dash-px-3 dash-py-2 dash-text-sm dash-text-foreground dash-outline-none focus:dash-border-primary"
            />
          </div>

          <div>
            <label className="dash-block dash-text-xs dash-font-bold dash-text-muted-foreground dash-mb-1 uppercase">Description</label>
            <textarea
              required
              rows={2}
              placeholder="Explain what the user needs to do..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="dash-w-full dash-rounded-lg dash-border dash-border-border dash-bg-background dash-px-3 dash-py-2 dash-text-sm dash-text-foreground dash-outline-none focus:dash-border-primary"
            />
          </div>

          <div className="dash-grid dash-grid-cols-2 dash-gap-4">
            <div>
              <label className="dash-block dash-text-xs dash-font-bold dash-text-muted-foreground dash-mb-1 uppercase">Category</label>
              <select
                value={formData.taskType}
                onChange={e => setFormData({ ...formData, taskType: e.target.value })}
                className="dash-w-full dash-rounded-lg dash-border dash-border-border dash-bg-background dash-px-3 dash-py-2 dash-text-sm dash-text-foreground dash-outline-none focus:dash-border-primary"
              >
                <option value="App">App</option>
                <option value="Signup">Signup</option>
                <option value="Survey">Survey</option>
                <option value="Website">Website</option>
                <option value="Social">Social</option>
              </select>
            </div>
            <div>
              <label className="dash-block dash-text-xs dash-font-bold dash-text-muted-foreground dash-mb-1 uppercase">Reward (Coins)</label>
              <input
                type="number"
                required
                min="1"
                value={formData.reward}
                onChange={e => setFormData({ ...formData, reward: e.target.value })}
                className="dash-w-full dash-rounded-lg dash-border dash-border-border dash-bg-background dash-px-3 dash-py-2 dash-text-sm dash-text-foreground dash-outline-none focus:dash-border-primary"
              />
            </div>
          </div>

          <div>
            <label className="dash-block dash-text-xs dash-font-bold dash-text-muted-foreground dash-mb-1 uppercase">Task Link (Optional)</label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.taskLink}
              onChange={e => setFormData({ ...formData, taskLink: e.target.value })}
              className="dash-w-full dash-rounded-lg dash-border dash-border-border dash-bg-background dash-px-3 dash-py-2 dash-text-sm dash-text-foreground dash-outline-none focus:dash-border-primary"
            />
          </div>

          <div className="dash-pt-2 dash-flex dash-justify-end dash-gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="dash-rounded-lg dash-px-4 dash-py-2 dash-text-sm dash-font-bold dash-text-muted-foreground dash-hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="dash-flex dash-items-center dash-gap-2 dash-rounded-lg dash-bg-primary dash-px-4 dash-py-2 dash-text-sm dash-font-bold dash-text-primary-foreground dash-hover:bg-primary/90"
            >
              {loading && <Loader2 className="dash-size-4 dash-animate-spin" />}
              Create Task
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
