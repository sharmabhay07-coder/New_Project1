import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle, XCircle, Search, Clock, ExternalLink, Plus } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import { getTaskSubmissions, reviewTaskSubmission } from '@/lib/api/taskApi'
import AdminConfirmModal from '../components/AdminConfirmModal'
import AdminCreateTaskModal from './components/AdminCreateTaskModal'

const ProofViewer = ({ url }) => {
  const [error, setError] = useState(false);
  
  if (!url) {
    return <div className="dash-flex dash-items-center dash-justify-center dash-w-full dash-h-full dash-text-muted-foreground">No Image</div>;
  }
  
  if (error) {
    return (
      <div className="dash-flex dash-flex-col dash-items-center dash-justify-center dash-w-full dash-h-full dash-bg-muted dash-p-4 dash-text-center">
        <span className="dash-text-sm dash-text-muted-foreground dash-mb-2">Image could not be loaded directly</span>
        <a href={url} target="_blank" rel="noreferrer" className="dash-text-xs dash-text-primary hover:dash-underline dash-font-medium dash-break-all">
          {url}
        </a>
      </div>
    );
  }
  
  return (
    <>
      <img 
        src={url} 
        alt="Proof" 
        className="dash-w-full dash-h-full dash-object-cover dash-cursor-pointer"
        onClick={() => window.open(url, '_blank')}
        onError={() => setError(true)}
      />
      <div className="dash-absolute dash-bottom-2 dash-right-2 dash-rounded-md dash-bg-black/60 dash-px-2 dash-py-1 dash-text-[10px] dash-font-bold dash-text-white dash-backdrop-blur dash-pointer-events-none">
        Click to enlarge
      </div>
    </>
  );
};

export default function AdminTasksPage() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('pending') // pending, approved, rejected
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, submissionId: null, action: null })
  const [processing, setProcessing] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { token } = useAuth()

  const fetchSubmissions = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getTaskSubmissions(token)
      setSubmissions(res.data?.submissions || [])
    } catch (err) {
      setError(err.message || 'Failed to load task submissions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchSubmissions()
  }, [token])

  const handleAction = async () => {
    const { submissionId, action } = confirmModal
    setProcessing(true)
    try {
      await reviewTaskSubmission(token, submissionId, action)
      setSubmissions(prev => prev.map(sub => {
        if (sub._id === submissionId) {
          return { ...sub, status: action, updatedAt: new Date().toISOString() }
        }
        return sub
      }))
    } catch (err) {
      alert(err.message || `Failed to ${action} submission`)
    } finally {
      setProcessing(false)
      setConfirmModal({ isOpen: false, submissionId: null, action: null })
    }
  }

  const filteredSubmissions = submissions.filter(s => s.status === activeTab)

  return (
    <div className="dash-page dash-space-y-6">
      <div className="dash-flex dash-items-center dash-justify-between">
        <div>
          <h1 className="dash-text-2xl dash-font-bold dash-text-foreground">Task Approvals</h1>
          <p className="dash-text-sm dash-text-muted-foreground">Review and approve user task submissions.</p>
        </div>
        <div className="dash-flex dash-items-center dash-gap-3">
          <button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="dash-flex dash-items-center dash-gap-2 dash-rounded-lg dash-bg-primary dash-px-4 dash-py-2 dash-text-sm dash-font-bold dash-text-primary-foreground dash-hover:bg-primary/90"
          >
            <Plus className="dash-size-4" />
            New Task
          </button>
          <button 
            onClick={fetchSubmissions} 
            className="dash-rounded-lg dash-border dash-border-border dash-bg-background dash-px-4 dash-py-2 dash-text-sm dash-font-medium dash-hover:bg-muted"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="dash-rounded-xl dash-border dash-border-destructive dash-bg-destructive/10 dash-p-4 dash-text-sm dash-text-destructive">
          {error}
        </div>
      )}

      {/* TABS */}
      <div className="dash-flex dash-items-center dash-gap-2 dash-border-b dash-border-border dash-pb-4">
        {['pending', 'approved', 'rejected'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`dash-rounded-lg dash-px-4 dash-py-2 dash-text-sm dash-font-semibold dash-capitalize dash-transition-colors ${
              activeTab === tab 
                ? 'dash-bg-primary dash-text-primary-foreground' 
                : 'dash-bg-muted/50 dash-text-muted-foreground dash-hover:bg-muted dash-hover:text-foreground'
            }`}
          >
            {tab}
            {tab === 'pending' && submissions.filter(s => s.status === 'pending').length > 0 && (
              <span className="dash-ml-2 dash-inline-flex dash-items-center dash-justify-center dash-rounded-full dash-bg-white/20 dash-px-2 dash-py-0.5 dash-text-xs">
                {submissions.filter(s => s.status === 'pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="dash-flex dash-items-center dash-justify-center dash-py-12">
          <Loader2 className="dash-size-8 dash-animate-spin dash-text-primary" />
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="dash-card dash-p-12 dash-text-center">
          <CheckCircle className="dash-mx-auto dash-size-12 dash-text-muted-foreground dash-mb-4 dash-opacity-20" />
          <h3 className="dash-text-lg dash-font-bold dash-text-foreground">No {activeTab} submissions</h3>
          <p className="dash-mt-1 dash-text-sm dash-text-muted-foreground">You are all caught up!</p>
        </div>
      ) : (
        <div className="dash-grid dash-grid-cols-1 dash-gap-4 md:dash-grid-cols-2 lg:dash-grid-cols-3">
          {filteredSubmissions.map(sub => (
            <div key={sub._id} className="dash-card dash-p-5 dash-shadow-soft dash-flex dash-flex-col">
              <div className="dash-flex dash-items-start dash-justify-between dash-mb-3">
                <div>
                  <h4 className="dash-font-bold dash-text-foreground dash-line-clamp-1">{sub.task?.title || 'Unknown Task'}</h4>
                  <p className="dash-text-xs dash-text-muted-foreground dash-mt-0.5">by {sub.user?.name || 'Unknown User'}</p>
                </div>
                <span className="dash-rounded-lg dash-bg-primary/10 dash-px-2 dash-py-1 dash-text-xs dash-font-bold dash-text-primary dash-shrink-0">
                  +₹{sub.task?.reward || 0}
                </span>
              </div>
              
              {/* Fraud Signals Panel */}
              <div className="dash-mb-4 dash-flex dash-flex-col dash-gap-2 dash-text-xs">
                {sub.expectedCode && (
                  <div className={`dash-px-2 dash-py-1.5 dash-rounded-md dash-font-medium dash-flex dash-justify-between ${sub.fraudStatus === 'MATCH' ? 'dash-bg-success/10 dash-text-success' : 'dash-bg-destructive/10 dash-text-destructive'}`}>
                    <span>Code: {sub.expectedCode}</span>
                    <span>Status: {sub.fraudStatus}</span>
                  </div>
                )}
                
                {sub.isDuplicate && (
                  <div className="dash-px-2 dash-py-1.5 dash-rounded-md dash-bg-destructive/10 dash-text-destructive dash-font-bold">
                    ⚠️ DUPLICATE PROOF DETECTED
                  </div>
                )}
                
                <div className="dash-flex dash-gap-2">
                  <span className={`dash-px-2 dash-py-1 dash-rounded-md dash-bg-muted dash-flex-1 dash-text-center ${sub.user?.riskLevel === 'HIGH' ? 'dash-text-destructive dash-font-bold' : ''}`}>
                    Risk: {sub.user?.riskLevel || 'LOW'}
                  </span>
                  <span className="dash-px-2 dash-py-1 dash-rounded-md dash-bg-muted dash-flex-1 dash-text-center">
                    Trust: {sub.user?.trustScore || 100}
                  </span>
                </div>
              </div>
              
              <div className="dash-relative dash-w-full dash-aspect-video dash-bg-muted dash-rounded-lg dash-overflow-hidden dash-mb-4">
                <ProofViewer url={sub.proofImage} />
              </div>

              {sub.submissionNote && (
                <div className="dash-mb-4 dash-rounded-lg dash-bg-muted/30 dash-p-3 dash-text-sm dash-text-muted-foreground dash-italic">
                  "{sub.submissionNote}"
                </div>
              )}

              <div className="dash-mt-auto dash-pt-4 dash-border-t dash-border-border dash-flex dash-items-center dash-gap-2">
                {activeTab === 'pending' ? (
                  <>
                    <button
                      onClick={() => setConfirmModal({ isOpen: true, submissionId: sub._id, action: 'rejected' })}
                      className="dash-flex-1 dash-rounded-lg dash-border dash-border-destructive/30 dash-bg-destructive/10 dash-py-2 dash-text-sm dash-font-bold dash-text-destructive dash-hover:bg-destructive/20 dash-transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => setConfirmModal({ isOpen: true, submissionId: sub._id, action: 'approved' })}
                      className="dash-flex-1 dash-rounded-lg dash-bg-success dash-py-2 dash-text-sm dash-font-bold dash-text-white dash-hover:bg-success/90 dash-transition-colors"
                    >
                      Approve
                    </button>
                  </>
                ) : (
                  <div className="dash-w-full dash-text-center dash-text-sm dash-font-medium dash-text-muted-foreground">
                    Reviewed on {new Date(sub.updatedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONFIRM MODAL */}
      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => !processing && setConfirmModal({ isOpen: false, submissionId: null, action: null })}
        onConfirm={handleAction}
        title={confirmModal.action === 'approved' ? 'Approve Submission' : 'Reject Submission'}
        description={
          confirmModal.action === 'approved' 
            ? 'Are you sure you want to approve this submission? The reward will be permanently added to the user\'s balance.' 
            : 'Are you sure you want to reject this submission? The user will not receive any reward.'
        }
        confirmText={confirmModal.action === 'approved' ? 'Yes, Approve' : 'Yes, Reject'}
        isLoading={processing}
        isDestructive={confirmModal.action === 'rejected'}
      />
      <AnimatePresence>
        <AdminCreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => alert('Task created successfully!')}
        />
      </AnimatePresence>
    </div>
  )
}
