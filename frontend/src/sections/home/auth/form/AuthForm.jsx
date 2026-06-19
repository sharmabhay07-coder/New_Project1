import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import LoginForm from '../../../../components/auth/LoginForm/LoginForm';
import RegisterForm from '../../../../components/auth/Registerform/RegisterForm';
// import GoogleButton from '../../../components/auth/GoogleButton/GoogleButton'; // TODO: re-enable once Google Client ID is set up
import './AuthForm.css';

export default function AuthForm() {
    const [tab, setTab] = useState('login'); // 'login' | 'register'

    return (
        <div className="right">
            <Toaster position="top-center" />

            <div className="tab-row">
                <button
                    className={`tab ${tab === 'login' ? 'active' : ''}`}
                    onClick={() => setTab('login')}
                >
                    Sign In
                </button>
                <button
                    className={`tab ${tab === 'register' ? 'active' : ''}`}
                    onClick={() => setTab('register')}
                >
                    Sign Up
                </button>
            </div>

            {/* <GoogleButton /> */}

            {/* <div className="divider">
        <div className="dline" />
        <span className="dtxt">or continue with email</span>
        <div className="dline" />
      </div> */}

            {tab === 'login' ? (
                <LoginForm onSwitch={() => setTab('register')} />
            ) : (
                <RegisterForm onSwitch={() => setTab('login')} />
            )}
        </div>
    );
}
