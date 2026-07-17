import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { Html5QrcodeScanner } from 'html5-qrcode';

const AttendanceScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanError);

    async function onScanSuccess(decodedText) {
      scanner.clear();
      try {
        const res = await api.post('/events/scan-attendance', { qrCodeData: decodedText });
        setScanResult(res.data.message);
      } catch (err) {
        setError(err.response?.data?.message || 'Error scanning ticket');
      }
    }

    function onScanError(err) {
      // Ignore silent errors from missing frame
    }

    return () => {
      scanner.clear().catch(error => console.error("Failed to clear scanner", error));
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">Ticket Scanner</h1>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          {scanResult ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Success</h2>
              <p className="text-slate-600 mb-6">{scanResult}</p>
              <button 
                onClick={() => { setScanResult(null); setError(''); window.location.reload(); }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Scan Next Ticket
              </button>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Invalid Ticket</h2>
              <p className="text-slate-600 mb-6">{error}</p>
              <button 
                onClick={() => { setError(''); window.location.reload(); }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div id="reader" className="w-full"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceScanner;
