import { AnimatePresence, motion } from 'framer-motion'

export default function AdminDeleteConfirmModal({
  title = 'Delete item',
  message,
  isOpen,
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="dash-fixed dash-inset-0 dash-z-50 dash-flex dash-items-center dash-justify-center dash-p-4"
          style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => e.target === e.currentTarget && onCancel()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="dash-w-full dash-max-w-md dash-rounded-3xl dash-border dash-border-border dash-bg-card dash-p-6 dash-shadow-soft-lg"
          >
            <h2 className="dash-m-0 dash-text-lg dash-font-bold dash-text-foreground">
              {title}
            </h2>
            <p className="dash-mt-2 dash-text-sm dash-text-muted-foreground">
              {message}
            </p>
            <div className="dash-flex dash-gap-3 dash-pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="dash-flex-1 dash-rounded-xl dash-border dash-border-border dash-py-2.5 dash-text-sm dash-font-medium dash-text-muted-foreground dash-hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="dash-flex-1 dash-rounded-lg dash-bg-destructive dash-px-3 dash-py-1.5 dash-text-xs dash-font-bold dash-text-white dash-transition-transform dash-hover:scale-105 dash-active:scale-95"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}