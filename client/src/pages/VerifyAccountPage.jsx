import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, CheckCircle } from 'lucide-react';

const VerifyAccountPage = () => {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { verifyAccount, resendVerificationCode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Get username from URL params or session storage
    const params = new URLSearchParams(location.search);
    const usernameParam = params.get('username');
    const storedUsername = sessionStorage.getItem('unconfirmedUser');
    
    if (usernameParam) {
      setUsername(usernameParam);
    } else if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [location.search]);
  
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!username || !code) {
      setMessage({ type: 'error', text: 'Please enter both username and verification code.' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await verifyAccount(username, code);
      setMessage({ 
        type: 'success', 
        text: 'Account verified successfully! You can now log in.' 
      });
      
      // Clear stored username
      sessionStorage.removeItem('unconfirmedUser');
      
      // Redirect to login after short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Verification failed. Please check your code and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResendCode = async () => {
    if (!username) {
      setMessage({ type: 'error', text: 'Please enter your username to resend the code.' });
      return;
    }
    
    try {
      await resendVerificationCode(username);
      setMessage({ 
        type: 'success', 
        text: 'Verification code has been resent. Please check your email.' 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to resend code. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Verify Your Account</h1>
          <p className="mt-2 text-gray-600">
            Enter the verification code sent to your email
          </p>
        </div>

        {message && (
          <div className={`mb-4 ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} px-4 py-3 rounded-lg flex items-start`}>
            {message.type === 'success' ? (
              <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
              placeholder="Enter verification code"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Verifying...' : 'Verify Account'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleResendCode}
            className="text-sm font-medium text-teal-600 hover:text-teal-500"
          >
            Resend verification code
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccountPage;