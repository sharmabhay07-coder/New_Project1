import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Clock, CheckCircle, ExternalLink, Loader2 } from 'lucide-react'
import { getTasks } from '@/lib/api/taskApi'
import useAuth from '@/hooks/useAuth'
import DashboardMiniProfile from '@/components/dashboard/dashboard-mini-profile'
import PlansPromoPanel from '@/components/dashboard/plans-promo-panel'

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState({})
  const { token } = useAuth()

  useEffect(() => {
    if (!token) { setLoading(false); return }
    getTasks(token)
      .then(res => setTasks(res.data?.tasks || []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false))
  }, [token])

  const handleStart = (taskId, taskLink) => {
    if (taskLink) window.open(taskLink, '_blank')
    setSubmitting(s => ({ ...s, [taskId]: 'started' }))
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr 280px',
        gap: '20px',
        alignItems: 'start',
      }}
    >
      <DashboardMiniProfile />

      <div className="dash-page">
        <div>
          <h1 className="dash-text-2xl dash-font-bold dash-text-foreground">Tasks</h1>
          <p className="dash-mt-1 dash-text-sm dash-text-muted-foreground">Complete tasks to earn extra rewards on top of videos.</p>
        </div>

        <div className="dash-grid dash-grid-cols-1 dash-gap-4">
          {[
            { label: 'Available', value: tasks.length, icon: Target, color: 'dash-text-primary' },
            { label: 'In Progress', value: Object.keys(submitting).length, icon: Clock, color: 'dash-text-warning' },
            { label: 'Completed', value: 0, icon: CheckCircle, color: 'dash-text-success' },
          ].map(s => (
            <div key={s.label} className="dash-card dash-p-6 dash-shadow-soft">
              <s.icon className={'dash-size-4 ' + s.color} />
              <p className="dash-mt-1 dash-text-xl dash-font-bold dash-text-foreground">{s.value}</p>
              <p className="dash-text-xs dash-text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="dash-flex dash-items-center dash-justify-center dash-py-16">
            <Loader2 className="dash-size-8 dash-animate-spin dash-text-primary" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="dash-card dash-p-5 dash-text-center">
            <p className="dash-text-muted-foreground">No tasks available yet</p>
          </div>
        ) : (
          <div className="dash-flex dash-flex-col dash-gap-3">
            {tasks.map((task, i) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="dash-card dash-p-6 dash-shadow-soft dash-transition-shadow dash-hover:shadow-soft-lg"
              >
                <div className="dash-flex dash-items-start dash-gap-4">
                  <div className="dash-shrink-0 dash-rounded-xl dash-bg-primary/10 dash-px-2.5 dash-py-1 dash-text-xs dash-font-bold dash-uppercase dash-text-primary">
                    {task.taskType || 'Task'}
                  </div>
                  <div className="dash-min-w-0 dash-flex-1">
                    <p className="dash-font-semibold dash-text-foreground">{task.title}</p>
                    <p className="dash-mt-0.5 dash-text-sm dash-text-muted-foreground">{task.description}</p>
                  </div>
                  <div className="dash-flex dash-shrink-0 dash-flex-col dash-items-end dash-gap-2">
                    <span className="dash-text-sm dash-font-bold dash-text-primary">+₹{task.reward?.toFixed(2)}</span>
                    {submitting[task._id] === 'started' ? (
                      <span className="dash-flex dash-items-center dash-gap-1 dash-rounded-lg dash-bg-warning/10 dash-px-3 dash-py-1.5 dash-text-xs dash-font-medium dash-text-warning">
                        <Clock className="dash-size-3" /> In Progress
                      </span>
                    ) : (
                      <button
                        onClick={() => handleStart(task._id, task.taskLink)}
                        className="dash-flex dash-items-center dash-gap-1 dash-rounded-lg dash-bg-primary dash-px-3 dash-py-1.5 dash-text-xs dash-font-bold dash-text-primary-foreground dash-transition-transform dash-hover:scale-105 dash-active:scale-95"
                      >
                        Start {task.taskLink && <ExternalLink className="dash-size-3" />}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <PlansPromoPanel />
    </div>
  )
}