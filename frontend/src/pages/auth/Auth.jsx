import { motion } from 'framer-motion';
import AuthHero from '../../sections/auth/hero/AuthHero';
import AuthForm from '../../sections/auth/form/AuthForm';
import './Auth.css';

const EARNINGS = [
  { text: '+$3.50', left: '5%', size: 32, duration: 10, delay: 0, color: '#10b981', endY: '-30vh' },
  { text: '+$12.00', left: '14%', size: 26, duration: 11, delay: 2, color: '#3b82f6', endY: '-50vh' },
  { text: '+$2.20', left: '22%', size: 30, duration: 9, delay: 5, color: '#f59e0b', endY: '-40vh' },
  { text: '+$5.00', left: '68%', size: 28, duration: 12, delay: 1, color: '#10b981', endY: '-60vh' },
  { text: '+$4.00', left: '76%', size: 24, duration: 10, delay: 3.5, color: '#8b5cf6', endY: '-35vh' },
  { text: '+$8.50', left: '85%', size: 34, duration: 11, delay: 0.5, color: '#3b82f6', endY: '-55vh' },
  { text: '+$1.80', left: '91%', size: 26, duration: 9, delay: 6, color: '#f59e0b', endY: '-45vh' },
  { text: '+$6.00', left: '8%', size: 22, duration: 13, delay: 4, color: '#10b981', endY: '-70vh' },
];

export default function Auth() {
  return (
    <div className="page-bg">
      <div className="page-grid" />

      {EARNINGS.map(({ text, left, size, duration, delay, color, endY }, i) => (
        <motion.div
          key={i}
          className="earning-float"
          style={{ left, fontSize: size, color }}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{ y: endY, opacity: [0, 0.95, 0.95, 0] }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: 'easeIn',
            opacity: {
              duration,
              delay,
              repeat: Infinity,
              times: [0, 0.08, 0.88, 1],
            },
          }}
        >
          {text}
        </motion.div>
      ))}

      <div className="modal">
        <AuthHero />
        <AuthForm />
      </div>
    </div>
  );
}