import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Clock, CheckCircle, XCircle, ExternalLink, Loader2 } from 'lucide-react'
import { getTasks } from '@/lib/api/taskApi'

const TYPE_COLOR = {
  youtube: 'bg-destructive/10 text-destructive',
  instagram: 'bg-pink-500/10 text-pink-600',
  twitter: 'bg-sky-500/10 text-sky-600',
  survey: 'bg-warning/10 text-warning',
  app: 'bg-accent/10 text-accent',
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState({})

  useEffect(() => {
    const token = localStorage.getItem('earnhub_token')
    if (!token) { setLoading(false); return }
    getTasks(token)
      .then(res => setTasks(res.data?.tasks || []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false))
  }, [])

  const handleStart = (taskId, taskLink) => {
    if (taskLink) window.open(taskLink, '_blank')
    setSubmitting(s => ({ ...s, [taskId]: 'started' }))
  }

  const mockTasks = [
    { _id: 'm1', title: 'Watch this YouTube video', description: 'Watch the full video and earn your reward.', taskType: 'youtube', reward: 2.5, taskLink: 'https://youtube.com' },
    { _id: 'm2', title: 'Follow us on Instagram', description: 'Follow our Instagram page to earn.', taskType: 'instagram', reward: 1.0, taskLink: '' },
    { _id: 'm3', title: 'Complete a quick survey', description: 'Answer 5 questions about your experience.', taskType: 'survey', reward: 3.0, taskLink: '' },
    { _id: 'm4', title: 'Download our partner app', description: 'Install and open the app to get rewarded.', taskType: 'app', reward: 5.0, taskLink: '' },
  ]

  const displayTasks = tasks.length > 0 ? tasks : mockTasks

  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
        <p className="mt-1 text-sm text-muted-foreground">Complete tasks to earn extra rewards on top of videos.</p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Available', value: displayTasks.length, icon: Target, color: 'text-primary' },
          { label: 'In Progress', value: Object.keys(submitting).length, icon: Clock, color: 'text-warning' },
          { label: 'Completed', value: 0, icon: CheckCircle, color: 'text-success' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <s.icon className={`size-4 ${s.color}`} />
            <p className="mt-1 text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Task list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {displayTasks.map((task, i) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-soft-lg"
            >
              <div className={`shrink-0 rounded-xl px-2.5 py-1 text-xs font-bold uppercase ${TYPE_COLOR[task.taskType] || 'bg-muted text-muted-foreground'}`}>
                {task.taskType || 'Task'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground line-clamp-1">{task.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span className="text-sm font-bold text-primary">+${task.reward?.toFixed(2)}</span>
                {submitting[task._id] === 'started' ? (
                  <span className="flex items-center gap-1 rounded-lg bg-warning/10 px-3 py-1.5 text-xs font-medium text-warning">
                    <Clock className="size-3" /> In Progress
                  </span>
                ) : (
                  <button
                    onClick={() => handleStart(task._id, task.taskLink)}
                    className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
                  >
                    Start {task.taskLink && <ExternalLink className="size-3" />}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
