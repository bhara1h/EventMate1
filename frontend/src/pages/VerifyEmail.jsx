import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await api.get(`/auth/verifyemail/${token}`);
        setStatus('success');
        setMessage(res.data.message);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Invalid or expired token');
      }
    };
    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full text-center">
          {status === 'verifying' && (
            <div>
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-bold text-slate-800">Verifying Email...</h2>
              <p className="text-slate-500 mt-2">Please wait while we verify your account.</p>
            </div>
          )}
          
          {status === 'success' && (
            <div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-green-600">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Verified!</h2>
              <p className="text-slate-600 mb-6">{message}</p>
              <Link to="/auth" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                Proceed to Login
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-red-600">✗</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Verification Failed</h2>
              <p className="text-slate-600 mb-6">{message}</p>
              <Link to="/auth" className="text-blue-600 font-bold hover:underline">
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
