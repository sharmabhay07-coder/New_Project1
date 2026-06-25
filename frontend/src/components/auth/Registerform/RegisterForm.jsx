import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Eye, EyeOff, Ticket, ChevronRight, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { registerSchema } from '../../../schemas/authSchemas';
import { registerUser, sendOtp, verifyOtp, loginUser } from '../../../api/authApi';
import useAuth from '../../../hooks/useAuth';

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
  const [step, setStep] = useState('form');   // 'form' | 'otp'
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema), defaultValues: { terms: false } });

  const pwValue = watch('password');
  const termsValue = watch('terms');
  const strength = getStrength(pwValue);

  // ── 30s resend countdown ──
  const startCountdown = () => {
    setCountdown(30);
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(id); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // ── Step 1: Register → then send OTP ──
  const onSubmit = async (values) => {
    try {
      // 1. Create account
      const regRes = await registerUser({
        name: values.name,
        email: values.email,
        mobileNumber: values.mobile,
        password: values.password,
        referralCode: values.referralCode,
      });

      const newUserId = regRes.data.user.id;
      setUserId(newUserId);
      setUserEmail(values.email);
      setUserPassword(values.password);

      // 2. Send OTP immediately
      setSendingOtp(true);
      await sendOtp({ userId: newUserId });
      setSendingOtp(false);

      startCountdown();
      setStep('otp');
      toast.success('Account created! OTP sent to your mobile 📱');
      toast('⚠️ Check your backend terminal for OTP (SMS not active yet)', {
        duration: 6000,
        icon: '🖥️',
      });
    } catch (err) {
      setSendingOtp(false);
      toast.error(err.message);
    }
  };

  // ── Resend OTP ──
  const handleResend = async () => {
    try {
      setSendingOtp(true);
      await sendOtp({ userId });
      setSendingOtp(false);
      startCountdown();
      toast.success('OTP resent! Check backend terminal');
    } catch (err) {
      setSendingOtp(false);
      toast.error(err.message);
    }
  };

  // ── Step 2: Verify OTP → auto login ──
  const handleVerify = async () => {
    if (otpValue.length < 6) {
      toast.error('Enter the 6-digit OTP');
      return;
    }
    try {
      setVerifying(true);

      console.log('Sending verify-otp with:', { userId, otp: otpValue });
      console.log('userId type:', typeof userId, '| otp type:', typeof otpValue);
      // 3. Verify OTP
      await verifyOtp({ userId, otp: otpValue });

      // 4. Auto login
      const loginRes = await loginUser({
        identifier: userEmail,
        password: userPassword,
      });

      login(loginRes.data.token, loginRes.data.user);
      toast.success(`Welcome to EarnHub, ${loginRes.data.user.name}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      setVerifying(false);
      toast.error(err.message);
    }
  };

  // ════════════════════════════════════
  // STEP 2 — OTP Screen
  // ════════════════════════════════════
  if (step === 'otp') {
    return (
      <div className="form-panel active">
        <div className="otp-screen">
          <div className="otp-screen-icon">📱</div>
          <div className="otp-screen-title">Verify your mobile</div>
          <div className="otp-screen-sub">
            We sent a 6-digit OTP to your registered mobile number.
            <br />
            <span style={{ color: '#f59e0b', fontSize: 12 }}>
              ⚠️ SMS not active yet — check backend terminal for OTP
            </span>
          </div>

          <div className="otp-big-input-wrap">
            <input
              type="tel"
              className="otp-big-input"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
              autoFocus
            />
          </div>

          <div className="otp-timer">
            {countdown > 0
              ? `Resend OTP in ${countdown}s`
              : <span className="otp-resend" onClick={handleResend}>
                {sendingOtp ? 'Sending...' : 'Resend OTP'}
              </span>
            }
          </div>

          <button
            className="btn-submit"
            onClick={handleVerify}
            disabled={verifying || otpValue.length < 6}
            style={{ marginTop: 8 }}
          >
            {verifying
              ? <Loader2 size={18} className="spin" />
              : <span className="btn-text">Verify & Start Earning →</span>}
          </button>

          <div className="switch-row" style={{ marginTop: 14 }}>
            <span
              className="switch-link"
              onClick={() => { setStep('form'); setOtpValue(''); }}
            >
              ← Go back
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════
  // STEP 1 — Registration Form
  // ════════════════════════════════════
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
              onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, ''); }}
            />
          </div>
          {errors.mobile && <div className="ferr" style={{ display: 'block' }}>{errors.mobile.message}</div>}
        </div>

        <div className="field">
          <label>Password <span style={{ color: '#bbb', fontWeight: 400 }}>(min. 6 chars)</span></label>
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
                  <div key={bar} className="pw-bar"
                    style={{ background: bar <= strength.score ? '#10b981' : 'rgba(0,0,0,0.08)' }}
                  />
                ))}
              </div>
              <span className="pw-lbl">{strength.label}</span>
            </div>
          )}
        </div>

        <div className="ref-toggle" onClick={() => setShowRef((v) => !v)}>
          <div className="ref-toggle-inner">
            <div className="ref-toggle-left">
              <div className="ref-icon">🎟️</div>
              <div>
                <div className="ref-toggle-title">Have a referral code?</div>
                <div className="ref-toggle-sub">Get bonus rewards on signup</div>
              </div>
            </div>
            <ChevronRight size={16} className="ref-arr"
              style={{ transform: showRef ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease', color: '#10b981' }}
            />
          </div>
        </div>

        {showRef && (
          <div className="ref-field" style={{ display: 'block', marginBottom: 11 }}>
            <div className="fw">
              <input
                type="text"
                placeholder="e.g. REF-XXXXXX"
                style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
                {...register('referralCode')}
                onInput={(e) => { e.target.value = e.target.value.toUpperCase(); }}
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

        <button
          className="btn-submit"
          type="submit"
          disabled={isSubmitting || sendingOtp || !termsValue}
          style={{ opacity: !termsValue ? 0.5 : 1 }}
        >
          {isSubmitting || sendingOtp
            ? <Loader2 size={18} className="spin" />
            : <span className="btn-text">Create My Account →</span>}
        </button>

        <div className="switch-row">
          Already have an account?{' '}
          <span className="switch-link" onClick={onSwitch}>Sign in →</span>
        </div>
      </form>
    </div>
  );
}