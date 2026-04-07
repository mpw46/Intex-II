import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { logoutUser } from '../api/authAPI';
import { useAuth } from '../context/AuthContext';

function LogoutPage() {
  const [message, setMessage] = useState('Signing you out...');
  const [errorMessage, setErrorMessage] = useState('');
  const { refreshAuthState } = useAuth();

  useEffect(() => {
    let isMounted = true;

    async function runLogout() {
      try {
        await logoutUser();
        await refreshAuthState();
        if (isMounted) {
          setMessage('You are now signed out.');
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : 'Unable to log out.'
          );
          setMessage('Logout did not complete.');
        }
      }
    }

    void runLogout();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-stone-200 shadow-sm p-8">
        <h2 className="text-xl font-bold text-stone-900 mb-3">Logout</h2>
        <p className="text-sm text-stone-600 mb-4">{message}</p>
        {errorMessage && (
          <div className="p-3 mb-4 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-800" role="alert">
            {errorMessage}
          </div>
        )}
        <div className="flex gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-2
              bg-haven-teal-600 text-white text-sm font-semibold rounded-lg
              hover:bg-haven-teal-700 transition-colors duration-150"
          >
            Go to Home
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-4 py-2
              border border-stone-300 text-stone-700 text-sm font-medium rounded-lg
              hover:bg-stone-50 transition-colors duration-150"
          >
            Sign In Again
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LogoutPage;
