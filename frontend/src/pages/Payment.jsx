import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Wallet, Landmark, Smartphone, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

const Payment = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Card'); // 'Card', 'UPI', 'Netbanking', 'Wallet'
  const [errorMsg, setErrorMsg] = useState('');

  // Payment fields
  const [transactionId, setTransactionId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const res = await api.get(`/events/${eventId}`);
      setEvent(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setErrorMsg('Event details could not be loaded.');
      setLoading(false);
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!transactionId) {
      setErrorMsg('Transaction ID is required for verification.');
      return;
    }
    setProcessing(true);
    setErrorMsg('');

    try {
      const verifyData = {
        eventId: event._id,
        transactionId: transactionId,
        screenshotUrl: screenshotUrl,
        paymentMethod: paymentMethod
      };

      const result = await api.post('/payments/manual-submit', verifyData);

      if (result.data.success) {
        alert('Payment Details Submitted! Waiting for Organizer Verification.');
        navigate('/student/dashboard', { state: { activeTab: 'tickets' } });
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Submission Failed.';
      setErrorMsg(errMsg);
      alert(errMsg);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="p-8 text-center text-red-600 font-bold max-w-md mx-auto mt-20">
          {errorMsg || 'Event not found.'}
        </div>
      </div>
    );
  }

  const baseFee = event.price || event.eventFee || 0;
  const tax = parseFloat((baseFee * 0.18).toFixed(2));
  const total = baseFee + tax;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Loading Overlay */}
      {processing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-xl font-bold tracking-wide animate-pulse">Processing Secure Payment...</p>
          <p className="text-sm text-slate-300 mt-2">Connecting to secure gateway. Please do not close or refresh this page.</p>
        </div>
      )}

      <div className="p-8 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Summary & Payment Option Selection */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ShieldCheck className="text-green-500 w-7 h-7" />
              Secure Checkout
            </h2>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
                <AlertCircle className="shrink-0 w-5 h-5" />
                <span className="text-sm font-medium">{errorMsg}</span>
              </div>
            )}

            {/* Payment Methods */}
            <p className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">Select Payment Method</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { id: 'Card', label: 'Card', icon: CreditCard },
                { id: 'UPI', label: 'UPI', icon: Smartphone },
                { id: 'Netbanking', label: 'Net Bank', icon: Landmark },
                { id: 'Wallet', label: 'Wallet', icon: Wallet },
              ].map(m => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition font-medium ${
                      paymentMethod === m.id
                        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Payment Inputs */}
            <form onSubmit={handlePay} className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  Please transfer the amount using your selected payment method to our official account, then enter the transaction details below.
                </p>
                <p className="text-xs text-blue-600 font-bold">UPI ID: eventmate@upi</p>
                <p className="text-xs text-blue-600 font-bold">Bank: SBI Account 1234567890 (IFSC: SBIN0000001)</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Transaction ID / Reference No.</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UPI1234567890"
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Payment Screenshot URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://imgur.com/your-screenshot.jpg"
                  value={screenshotUrl}
                  onChange={e => setScreenshotUrl(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition"
                />
                <p className="text-[10px] text-slate-400 mt-1">Upload your screenshot to a drive/image host and paste the link here.</p>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 mt-6"
              >
                Pay Securely ₹{total}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Event details & Pricing Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
                Paid Registration
              </span>
              <h3 className="text-xl font-bold text-slate-800 mt-3">{event.title || event.eventName}</h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-3">{event.description}</p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Organizer</span>
                <span className="font-semibold text-slate-800">{event.organizer?.name || 'College Host'}</span>
              </div>
              <div className="flex justify-between">
                <span>Date</span>
                <span className="font-semibold text-slate-800">{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Time</span>
                <span className="font-semibold text-slate-800">{event.time}</span>
              </div>
              <div className="flex justify-between">
                <span>Location</span>
                <span className="font-semibold text-slate-800 truncate max-w-[200px]">{event.location}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h4 className="font-bold text-slate-700 text-sm">Price Details</h4>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Event Fee</span>
                <span>₹{baseFee}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Tax (18% GST)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Secure Gateway Fee</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3 font-bold text-lg text-slate-800">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400">
            By completing this transaction, you agree to our Terms & Conditions.
            <br />
            Payments are secured by industry-standard encryption algorithms.
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payment;
