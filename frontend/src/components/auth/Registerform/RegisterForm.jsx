import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Eye, EyeOff, Ticket, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { registerSchema } from '../../../schemas/authSchemas';
import { registerUser, sendOtp, verifyOtp } from '../../../api/authApi';
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
  const [step, setStep] = useState('form');
  const [registrationId, setRegistrationId] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [expiresInMinutes, setExpiresInMinutes] = useState(5);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showEmailRecovery, setShowEmailRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveringOtp, setRecoveringOtp] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema), defaultValues: { terms: false } });

  const pwValue = useWatch({ control, name: 'password' });
  const termsValue = useWatch({ control, name: 'terms' });
  const strength = getStrength(pwValue);

  // ── 30s resend countdown ──
  useEffect(() => {
    if (countdown <= 0) return undefined;

    const id = setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  const applyOtpPolicy = (response) => {
    const resendSeconds = response?.data?.resendAfterSeconds;
    const expirySeconds = response?.data?.expiresInSeconds;
    setCountdown(Number.isInteger(resendSeconds) ? resendSeconds : 30);
    setExpiresInMinutes(Number.isInteger(expirySeconds) ? Math.ceil(expirySeconds / 60) : 5);
  };

  // ── Step 1: Register → then send OTP ──
  const onSubmit = async (values) => {
    try {
      const regRes = await registerUser({
        name: values.name,
        email: values.email,
        mobileNumber: values.mobile,
        password: values.password,
        referralCode: values.referralCode,
      });

      setRegistrationId(regRes.data.registration.id);
      setUserEmail(regRes.data.registration.email);
      applyOtpPolicy(regRes);
      setStep('otp');
      toast.success('OTP sent to your email');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ── Resend OTP (supports registrationId or email) ──
  const handleResend = async () => {
    if (sendingOtp) return;

    try {
      setSendingOtp(true);
      const params = registrationId ? { registrationId } : { email: userEmail };
      const otpResponse = await sendOtp(params);
      applyOtpPolicy(otpResponse);
      toast.success('A new OTP was sent to your email');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSendingOtp(false);
    }
  };

  // ── Recover registration via email ──
  const handleEmailRecovery = async () => {
    if (!recoveryEmail || recoveringOtp) return;
    try {
      setRecoveringOtp(true);
      const otpResponse = await sendOtp({ email: recoveryEmail });
      setUserEmail(recoveryEmail);
      setRegistrationId(null);
      setShowEmailRecovery(false);
      applyOtpPolicy(otpResponse);
      toast.success('OTP sent to your email');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRecoveringOtp(false);
    }
  };

  // ── Step 2: Verify OTP → auto login (supports registrationId or email) ──
  const handleVerify = async () => {
    if (otpValue.length < 6) {
      toast.error('Enter the 6-digit OTP');
      return;
    }
    try {
      setVerifying(true);

      const params = registrationId
        ? { registrationId, otp: otpValue }
        : { email: userEmail, otp: otpValue };

      const verifyRes = await verifyOtp(params);
      login(verifyRes.data.token, verifyRes.data.user);
      toast.success(`Welcome to EarnHub, ${verifyRes.data.user.name}! 🎉`);
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
        <form className="otp-screen" onSubmit={(event) => { event.preventDefault(); handleVerify(); }}>
          <div className="otp-screen-icon"><Mail size={32} aria-hidden="true" /></div>
          <div className="otp-screen-title">Verify your email</div>
          <div className="otp-screen-sub">
            We sent a 6-digit OTP to {userEmail || 'your registered email address'}.
            <br />
            <span style={{ color: '#6b7280', fontSize: 12 }}>
              It expires in {expiresInMinutes} minutes. Check your spam or junk folder if needed.
            </span>
          </div>

          <div className="otp-big-input-wrap">
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="one-time-code"
              aria-label="Six-digit verification code"
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
              : <button type="button" className="otp-resend" onClick={handleResend} disabled={sendingOtp}>
                {sendingOtp ? 'Sending...' : 'Resend OTP'}
              </button>
            }
          </div>

          <button
            className="btn-submit"
            type="submit"
            disabled={verifying || otpValue.length < 6}
            style={{ marginTop: 8 }}
          >
            {verifying
              ? <Loader2 size={18} className="spin" />
              : <span className="btn-text">Verify & Start Earning →</span>}
          </button>

          {!showEmailRecovery ? (
            <button
              type="button"
              className="otp-recovery-trigger"
              onClick={() => setShowEmailRecovery(true)}
            >
              Lost access to this session? Recover via email →
            </button>
          ) : (
            <div className="otp-recovery-form">
              <div style={{ fontSize: 13, color: '#999', marginBottom: 8 }}>
                Enter the email you used to register. We'll send a fresh OTP.
              </div>
              <div className="fw" style={{ marginBottom: 10 }}>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  autoFocus
                />
                <Mail size={16} className="fi" />
              </div>
              <button
                type="button"
                className="btn-submit"
                onClick={handleEmailRecovery}
                disabled={recoveringOtp || !recoveryEmail}
                style={{ padding: '10px', fontSize: 13 }}
              >
                {recoveringOtp
                  ? <Loader2 size={16} className="spin" />
                  : 'Send OTP to this email'}
              </button>
              <button
                type="button"
                className="switch-link"
                onClick={() => setShowEmailRecovery(false)}
                style={{ display: 'block', marginTop: 8, fontSize: 12 }}
              >
                ← Cancel
              </button>
            </div>
          )}

          <div className="switch-row" style={{ marginTop: 14 }}>
            <button
              type="button"
              className="switch-link"
              onClick={onSwitch}
            >
              ← Back to sign in
            </button>
          </div>
        </form>
      </div>
    );
  }

  // STEP 1 — Registration Form
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
            <button
              type="button"
              className="fi click password-toggle"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
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

        <button
          type="button"
          className="ref-toggle"
          onClick={() => setShowRef((v) => !v)}
          aria-expanded={showRef}
        >
          <span className="ref-toggle-inner">
            <span className="ref-toggle-left">
              <span className="ref-icon">🎟️</span>
              <span>
                <span className="ref-toggle-title">Have a referral code?</span>
                <span className="ref-toggle-sub">Connect your account to your referrer</span>
              </span>
            </span>
            <ChevronRight size={16} className="ref-arr"
              style={{ transform: showRef ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease', color: '#10b981' }}
            />
          </span>
        </button>

        {showRef && (
          <div className="ref-field" style={{ display: 'block', marginBottom: 11 }}>
            <div className="fw">
              <input
                type="text"
                placeholder="e.g. REF-A1B2C3"
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
            <button
              type="button"
              className="terms-link"
              onClick={(event) => { event.preventDefault(); toast('📄 Opening Terms...'); }}
            >
              Terms of Service
            </button> and{' '}
            <button
              type="button"
              className="terms-link"
              onClick={(event) => { event.preventDefault(); toast('🔒 Opening Privacy Policy...'); }}
            >
              Privacy Policy
            </button>
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
          <button type="button" className="switch-link" onClick={onSwitch}>Sign in →</button>
        </div>
      </form>
    </div>
  );
}
