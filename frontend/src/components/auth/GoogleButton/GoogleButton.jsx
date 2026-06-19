import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { googleAuth } from '../../../api/authApi';

export default function GoogleButton() {
    const handleSuccess = async (credentialResponse) => {
        try {
            await googleAuth(credentialResponse.credential);
            toast.success('Signed in with Google!');
            // TODO: store token / redirect to dashboard
        } catch (err) {
            toast.error(err.message || 'Google sign-in failed');
        }
    };

    return (
        <div className="btn-google-wrap">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => toast.error('Google sign-in failed')}
                width="100%"
                text="continue_with"
                shape="rectangular"
            />
        </div>
    );
}
