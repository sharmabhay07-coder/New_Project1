import { useState } from 'react';
import '../../../sections/home/auth/form/AuthForm.css';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Eye, EyeOff, Ticket, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerSchema } from '../../../schemas/authSchemas';
import { registerUser } from '../../../api/authApi';

function getStrength(pw) {
  if (!pw) return { score: 0, label: 'Weak' };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ['Weak', 'Weak', 'Okay', 'Good', 'Strong'];
  return { score, label: labels[score] };
}

export default function RegisterForm({ onSwitch }) {
  const [showPw, setShowPw] = useState(false);
  const [showRef, setShowRef] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema), defaultValues: { terms: false } });

  const pwValue = watch('password');
  const strength = getStrength(pwValue);

  const onSubmit = async (values) => {
    try {
      await registerUser(values);
      toast.success('Account created! Welcome to EarnHub 🎉');
      // TODO: store token / redirect to dashboard
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="form-panel active">
      <div className="right-head">
        <div className="right-title">Create your account 🚀</div>
        <div className="right-sub">Start earning in under 2 minutes</div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field-row">
          <div>
            <label>Full Name</label>
            <div className="fw">
              <input
                type="text"
                placeholder="Your name"
                className={errors.name ? 'err' : ''}
                {...register('name')}
              />
              <User size={16} className="fi" />
            </div>
            {errors.name && <div className="ferr" style={{ display: 'block' }}>{errors.name.message}</div>}
          </div>

          <div>
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
        </div>

        <div className="field">
          <label>Mobile Number</label>
          <div className="phone-row">
            <div className="phone-pfx">🇮🇳 +91</div>
            <input
              type="tel"
              placeholder="10-digit number"
              maxLength={10}
              className={errors.mobile ? 'err' : ''}
              {...register('mobile')}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
              }}
            />
          </div>
          {errors.mobile && <div className="ferr" style={{ display: 'block' }}>{errors.mobile.message}</div>}
        </div>

        <div className="field">
          <label>
            Password <span style={{ color: '#bbb', fontWeight: 400 }}>(min. 6 chars)</span>
          </label>
          <div className="fw">
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Create a strong password"
              className={errors.password ? 'err' : ''}
              {...register('password')}
            />
            <span className="fi click" onClick={() => setShowPw((v) => !v)}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </span>
          </div>
          {errors.password && <div className="ferr" style={{ display: 'block' }}>{errors.password.message}</div>}

          {pwValue && (
            <div className="pw-str">
              <div className="pw-bars">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className="pw-bar"
                    style={{
                      background: bar <= strength.score ? '#10b981' : 'rgba(255,255,255,0.12)',
                    }}
                  />
                ))}
              </div>
              <span className="pw-lbl">{strength.label}</span>
            </div>
          )}
        </div>

        <div className="ref-toggle" onClick={() => setShowRef((v) => !v)}>
          <ChevronRight size={12} className="ref-arr" style={{ transform: showRef ? 'rotate(90deg)' : 'none' }} />
          Have a referral code? <span style={{ color: '#10b981', fontWeight: 700 }}>(optional)</span>
        </div>

        {showRef && (
          <div className="ref-field">
            <div className="fw">
              <input
                type="text"
                placeholder="e.g. EH-XXXXXX"
                style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
                {...register('referralCode')}
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
              <Ticket size={16} className="fi" />
            </div>
          </div>
        )}

        <div className="terms-row">
          <input type="checkbox" id="terms" {...register('terms')} />
          <label htmlFor="terms">
            I agree to EarnHub's{' '}
            <a onClick={() => toast('📄 Opening Terms...')}>Terms of Service</a> and{' '}
            <a onClick={() => toast('🔒 Opening Privacy Policy...')}>Privacy Policy</a>
          </label>
        </div>
        {errors.terms && <div className="ferr" style={{ display: 'block' }}>{errors.terms.message}</div>}

        <button className="btn-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 size={18} className="spin" />
          ) : (
            <span className="btn-text">Create My Account →</span>
          )}
        </button>

        <div className="switch-row">
          Already have an account?{' '}
          <span className="switch-link" onClick={onSwitch}>
            Sign in →
          </span>
        </div>
      </form>
    </div>
  );
}
