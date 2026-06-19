import AuthHero from '../../sections/home/auth/hero/AuthHero';
import AuthForm from '../../sections/home/auth/form/AuthForm';
import './Auth.css';

export default function Auth() {
  return (
    <div className="page-bg">
      <div className="page-grid" />
      <div className="modal">
        <AuthHero />
        <AuthForm />
      </div>
    </div>
  );
}
