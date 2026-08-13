import { AnimatePresence, motion } from "framer-motion";
import { LogOut, X } from "lucide-react";
import "./LogoutConfirmModal.css";

export default function LogoutConfirmModal({ isOpen, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="logout-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onCancel}
        >
          <motion.div
            className="logout-modal-box"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="logout-modal-close" onClick={onCancel} aria-label="Close">
              <X size={18} />
            </button>

            <div className="logout-modal-icon">
              <LogOut size={26} />
            </div>

            <h3 className="logout-modal-title">Log out of EarnHub?</h3>
            <p className="logout-modal-text">
              You'll need to sign in again to access your dashboard, earnings, and progress.
            </p>

            <div className="logout-modal-actions">
              <button className="logout-modal-btn logout-modal-btn--cancel" onClick={onCancel}>
                Stay logged in
              </button>
              <button className="logout-modal-btn logout-modal-btn--confirm" onClick={onConfirm}>
                Log out
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}