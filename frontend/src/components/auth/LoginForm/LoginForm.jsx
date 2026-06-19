import { useState } from 'react';
import '../../../sections/home/auth/form/AuthForm.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginSchema } from '../../../schemas/authSchemas';
import { loginUser } from '../../../api/authApi';

export default function LoginForm({ onSwitch }) {
  const [showPw, setShowPw] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    try {
      await loginUser(values);
      toast.success('Welcome back! Redirecting…');
      // TODO: store token / redirect to dashboard
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="form-panel active">
      <div className="right-head">
        <div className="right-title">Welcome back 👋</div>
        <div className="right-sub">Sign in to continue earning</div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field">
          <label>Email Address</label>
          <div className="fw">
            <input
              type="email"
              placeholder="you@example.com"
              className={errors.email ? 'err' : ''}
              {...register('email')}
            />
            <Mail size={16} className="fi" />
          </div>
          {errors.email && <div className="ferr" style={{ display: 'block' }}>{errors.email.message}</div>}
        </div>

        <div className="field">
          <label>Password</label>
          <div className="fw">
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Enter your password"
              className={errors.password ? 'err' : ''}
              {...register('password')}
            />
            <span className="fi click" onClick={() => setShowPw((v) => !v)}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </span>
          </div>
          {errors.password && <div className="ferr" style={{ display: 'block' }}>{errors.password.message}</div>}
        </div>

        <div className="forgot-row">
          <a className="forgot-link" onClick={() => toast('📧 Reset link sent!')}>
            Forgot password?
          </a>
        </div>

        <button className="btn-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 size={18} className="spin" />
          ) : (
            <span className="btn-text">Sign In to EarnHub</span>
          )}
        </button>

        <div className="switch-row">
          Don't have an account?{' '}
          <span className="switch-link" onClick={onSwitch}>
            Sign up free →
          </span>
        </div>
      </form>
    </div>
  );
}
