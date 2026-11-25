import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatLakhs, formatINR, initialListings } from '../data/cars';
import toast from 'react-hot-toast';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  CreditCard, 
  QrCode, 
  Landmark, 
  ArrowRight, 
  Clock, 
  FileCode, 
  ChevronRight,
  Info,
  ShieldAlert
} from 'lucide-react';

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, buyerUser, createEscrowOrder } = useAuth();

  const rawCar = cars.find(c => c.id === id) || initialListings.find(c => c.id === id);
  const car = rawCar ? {
    ...rawCar,
    images: rawCar.images || [rawCar.image],
    biddingEnabled: rawCar.biddingEnabled ?? (rawCar.mode === "Auction"),
    currentBid: rawCar.currentBid ?? rawCar.price,
    seller: rawCar.seller || {
      id: "usr_seller_01",
      name: "Verified Seller",
      city: rawCar.city || "Mumbai",
      phone: "+91 98765 43210",
      email: "seller@marketplace.in",
      pan: "ABCDE1234F",
      linkedAccountId: "acc_H23k98sL12",
      bankVerified: rawCar.verified ?? true,
      bankName: "HDFC Bank (A/C: ****4892)"
    }
  } : null;

  const [paymentMethod, setPaymentMethod] = useState('netbanking'); // 'netbanking' | 'rtgs' | 'upi' | 'card'
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayloadInspector, setShowPayloadInspector] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [verifyingSignature, setVerifyingSignature] = useState(false);

  if (!car) {
    return (
      <div className="section py-20 text-center">
        <h2 className="text-xl font-bold">Vehicle Not Found</h2>
        <Link to="/cars" className="btn btn-primary mt-4 inline-flex">Browse Cars</Link>
      </div>
    );
  }

  const effectivePrice = car.biddingEnabled ? car.currentBid : car.price;
  const platformCommissionPaise = Math.round(effectivePrice * 0.05 * 100);
  const platformCommissionINR = platformCommissionPaise / 100;
  const gstOnCommission = Math.round(platformCommissionINR * 0.18); // 18% GST on platform commission
  const sellerPayoutINR = effectivePrice - platformCommissionINR;
  const sellerPayoutPaise = sellerPayoutINR * 100;

  // Exact JSON payload as specified in Step B of the PDF integration doc
  const razorpayOrderPayload = {
    amount: effectivePrice * 100, // in paise
    currency: 'INR',
    receipt: `order_rcptid_${car.id}`,
    transfers: [
      {
        account: car.seller.linkedAccountId || 'acc_H23k98sL12',
        amount: sellerPayoutPaise,
        currency: 'INR',
        notes: {
          listing_id: car.id,
          platform_commission_paise: String(platformCommissionPaise),
          gst_18_paise: String(gstOnCommission * 100)
        },
        on_hold: 1 // Critical: locks funds in nodal account
      }
    ]
  };

  const handleInitiatePayment = () => {
    if (!agreedToTerms) {
      toast.error('Please accept the Escrow Agreement and RBI compliance terms.');
      return;
    }
    setCheckoutModalOpen(true);
  };

  const handleSimulatePaymentSuccess = () => {
    setIsProcessing(true);
    setCheckoutModalOpen(false);
    setVerifyingSignature(true);

    // Simulate Step C: HMAC SHA256 Signature verification
    setTimeout(() => {
      const createdOrder = createEscrowOrder({
        car,
        paymentMethod: paymentMethod === 'netbanking' ? `Netbanking (${selectedBank})` : paymentMethod.toUpperCase()
      });

      setVerifyingSignature(false);
      setIsProcessing(false);

      toast.success('HMAC SHA256 Signature verified! Funds secured in Escrow.', {
        icon: '🛡️',
        duration: 5000
      });

      navigate('/dashboard/buyer');
    }, 2200);
  };

  return (
    <div className="section py-10 space-y-8">
      {/* Checkout Progress Stepper */}
      <div className="max-w-3xl mx-auto flex items-center justify-between text-xs font-semibold text-slate-500 pb-4 border-b border-surface-200">
        <div className="flex items-center gap-2 text-brand-600">
          <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">1</span>
          <span>Winning Bid Review</span>
        </div>
        <div className="h-0.5 w-12 bg-surface-200" />
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-6 h-6 rounded-full bg-surface-200 text-slate-600 flex items-center justify-center text-xs font-bold">2</span>
          <span>Nodal Escrow Deposit</span>
        </div>
        <div className="h-0.5 w-12 bg-surface-200" />
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-6 h-6 rounded-full bg-surface-200 text-slate-600 flex items-center justify-center text-xs font-bold">3</span>
          <span>Handover & Release</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Payment Method Selection & Security Info (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-brand-700 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>RBI PA/PG Escrow Gateway</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">Select Payment Method</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Funds are routed to the gateway's nodal escrow account, not directly to the seller.
              </p>
            </div>

            {/* High Value Notice (Page 4 from PDF doc) */}
            {effectivePrice > 100000 && (
              <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-3 text-xs text-amber-900">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">High-Value Vehicle Transaction Note:</strong>
                  <p className="text-amber-800 mt-0.5 leading-relaxed">
                    Standard UPI is capped at ₹1,00,000 per transaction by NPCI. For this ₹{(effectivePrice / 100000).toFixed(2)} Lakh vehicle purchase, please use <strong>Netbanking</strong> or an <strong>RTGS/NEFT Virtual Escrow Account</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="space-y-3">
              {/* Option 1: Netbanking (Recommended) */}
              <label 
                className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'netbanking' 
                    ? 'border-brand-600 bg-brand-50/40 ring-1 ring-brand-300' 
                    : 'border-surface-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="pm"
                  checked={paymentMethod === 'netbanking'}
                  onChange={() => setPaymentMethod('netbanking')}
                  className="mt-1 w-4 h-4 text-brand-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-brand-600" />
                      Netbanking (Instant Escrow Confirmation)
                    </span>
                    <span className="badge badge-blue text-[10px]">Recommended</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports all major Indian banks with immediate split authorization.
                  </p>

                  {paymentMethod === 'netbanking' && (
                    <div className="mt-3 pt-3 border-t border-brand-100 flex gap-2">
                      {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak'].map(b => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setSelectedBank(b)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                            selectedBank === b 
                              ? 'bg-brand-600 text-white shadow-xs' 
                              : 'bg-white border border-surface-200 text-slate-700 hover:bg-surface-50'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </label>

              {/* Option 2: RTGS / NEFT Virtual Escrow Account */}
              <label 
                className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'rtgs' 
                    ? 'border-brand-600 bg-brand-50/40 ring-1 ring-brand-300' 
                    : 'border-surface-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="pm"
                  checked={paymentMethod === 'rtgs'}
                  onChange={() => setPaymentMethod('rtgs')}
                  className="mt-1 w-4 h-4 text-brand-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      RTGS / NEFT Dedicated Virtual Account
                    </span>
                    <span className="badge badge-purple text-[10px]">No Limit</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Unique Razorpay Virtual Account generated for single-order direct high-ticket settlement.
                  </p>
                </div>
              </label>

              {/* Option 3: UPI (with limit warning) */}
              <label 
                className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'upi' 
                    ? 'border-brand-600 bg-brand-50/40 ring-1 ring-brand-300' 
                    : 'border-surface-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="pm"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="mt-1 w-4 h-4 text-brand-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      UPI (GPay / PhonePe / Paytm / BHIM)
                    </span>
                    <span className="badge badge-amber text-[10px]">₹1L Max Limit</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Applicable for token advances or transactions &le; ₹1,00,000.
                  </p>
                </div>
              </label>
            </div>

            {/* Buyer KYC info check */}
            <div className="bg-surface-50 p-4 rounded-xl border border-surface-200 text-xs space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wide text-[11px] block">
                Buyer Details (Invoiced Entity)
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400">Name:</span> <strong className="text-slate-800">{buyerUser.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400">PAN:</span> <span className="font-mono">{buyerUser.pan}</span>
                </div>
                <div>
                  <span className="text-slate-400">Mobile:</span> {buyerUser.phone}
                </div>
                <div>
                  <span className="text-slate-400">Email:</span> {buyerUser.email}
                </div>
              </div>
            </div>

            {/* Developer / Technical API Payload Inspector Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowPayloadInspector(!showPayloadInspector)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800 cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{showPayloadInspector ? 'Hide' : 'Inspect'} Razorpay Route Order JSON Payload</span>
              </button>

              {showPayloadInspector && (
                <div className="mt-3 p-4 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto shadow-inner border border-slate-800">
                  <p className="text-slate-400 text-[11px] mb-2 font-sans">
                    // POST https://api.razorpay.com/v1/orders (Split & on_hold: 1 rule)
                  </p>
                  <pre>{JSON.stringify(razorpayOrderPayload, null, 2)}</pre>
                </div>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-brand-600 focus:ring-brand-400 border-slate-300"
                />
                <span>
                  I understand that my payment of <strong>{formatINR(effectivePrice)}</strong> will be held in the payment gateway's regulated Nodal Escrow account with <code className="text-brand-700 font-bold">on_hold: 1</code>. Funds are transferred to the seller only after I conduct physical inspection and click "Confirm Delivery".
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Payout Split (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="card p-6 border-brand-200 shadow-card-hover space-y-5">
            <h3 className="font-bold text-slate-900 text-base border-b border-surface-200 pb-3">
              Split-Settlement Breakdown
            </h3>

            {/* Vehicle Card mini */}
            <div className="flex gap-3">
              <img
                src={car.images[0]}
                alt={car.title}
                className="w-20 h-16 rounded-xl object-cover border border-surface-200 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-sm truncate">{car.title}</h4>
                <p className="text-xs text-slate-500">{car.city} &bull; {car.year}</p>
                <span className="badge badge-slate text-[10px] mt-1">ID: {car.id}</span>
              </div>
            </div>

            {/* Accounting & Split Math (from Page 2 & 3 of Doc) */}
            <div className="space-y-3 pt-3 border-t border-surface-200 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Winning Bid Total:</span>
                <strong className="text-slate-900">{formatINR(effectivePrice)}</strong>
              </div>

              <div className="p-3 bg-brand-50/70 rounded-xl border border-brand-100 space-y-2">
                <div className="flex justify-between text-brand-900 font-medium">
                  <span>Platform Commission (5%):</span>
                  <span>{formatINR(platformCommissionINR)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>GST on Commission (18%):</span>
                  <span>{formatINR(gstOnCommission)} (Included)</span>
                </div>
                <div className="pt-2 border-t border-brand-200/60 flex justify-between font-bold text-emerald-800">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Seller Net Payout (Held in Escrow):
                  </span>
                  <span>{formatINR(sellerPayoutINR)}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Transferred directly to seller linked account (<code className="text-slate-600">{car.seller.linkedAccountId}</code>) upon delivery confirmation.
                </p>
              </div>

              <div className="pt-3 border-t border-surface-200 flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold text-slate-900">Total Due by Buyer:</span>
                  <p className="text-[10px] text-slate-400">Zero buyer processing surcharge</p>
                </div>
                <span className="text-2xl font-black text-slate-900">
                  {formatINR(effectivePrice)}
                </span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handleInitiatePayment}
              disabled={isProcessing || verifyingSignature}
              className="btn btn-primary w-full py-4 text-base font-bold shadow-lg shadow-brand-500/25 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Deposit Winning Bid of {formatINR(effectivePrice)} to Escrow</span>
            </button>

            <div className="p-3 bg-surface-50 rounded-xl text-[11px] text-slate-500 space-y-1">
              <p className="flex items-center gap-1.5 font-semibold text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                RBI Nodal Escrow Safeguard
              </p>
              <p>
                If seller fails to deliver vehicle or RC transfer papers, 100% of your deposit is reversed back cleanly via gateway refund API.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Simulated Checkout Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-surface-200 overflow-hidden animate-slide-up">
            {/* Modal Header (matches Razorpay Checkout SDK aesthetic) */}
            <div className="bg-gradient-to-r from-brand-700 to-indigo-800 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-sm">
                    R
                  </div>
                  <span className="font-bold text-sm">Razorpay Route &bull; Escrow Checkout</span>
                </div>
                <button
                  onClick={() => setCheckoutModalOpen(false)}
                  className="text-white/80 hover:text-white text-lg font-bold cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <div>
                <p className="text-xs text-brand-200">Paying for {car.title}</p>
                <p className="text-3xl font-black mt-1">{formatINR(effectivePrice)}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-full text-[11px] text-emerald-300">
                  <Lock className="w-3 h-3" />
                  <span>Escrow Hold: on_hold = 1</span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="p-3 bg-surface-50 rounded-xl text-xs space-y-1.5 border border-surface-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Gateway Order ID:</span>
                  <code className="font-mono font-bold text-brand-700">order_{Math.random().toString(36).substring(2, 9)}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Seller Sub-Merchant:</span>
                  <code className="font-mono text-slate-700">{car.seller.linkedAccountId}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Method:</span>
                  <span className="font-semibold text-slate-800">{paymentMethod.toUpperCase()}</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-2">
                <p className="font-medium text-slate-800">
                  Simulating Razorpay Checkout Callback:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-500">
                  <li>Dispatches payment through mock bank gateway</li>
                  <li>Generates <code className="text-slate-700">razorpay_payment_id</code></li>
                  <li>Calculates HMAC-SHA256 signature check</li>
                  <li>Updates backend state to <code className="text-brand-700 font-bold">PAID_IN_ESCROW</code></li>
                </ul>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setCheckoutModalOpen(false)}
                  className="btn btn-outline flex-1 py-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSimulatePaymentSuccess}
                  className="btn btn-primary flex-1 py-3 text-xs font-bold"
                >
                  Authorize Payment (Mock)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signature Verification Overlay */}
      {verifyingSignature && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-brand-50 border-4 border-brand-500/20 border-t-brand-600 animate-spin mx-auto" />
            <h4 className="font-bold text-slate-900 text-base">Verifying HMAC Signature</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-mono">
              order_id + "|" + payment_id &rarr; HMAC SHA256 match verified against API Secret
            </p>
            <div className="badge badge-green text-xs">
              Locking Funds in Nodal Escrow...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
