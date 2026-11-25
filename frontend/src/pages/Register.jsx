import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Mail, Lock, Landmark, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const { setRole, updateSellerKYC } = useAuth();
  const [selectedRole, setSelectedRole] = useState('seller');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [pan, setPan] = useState('');
  const [bankAcc, setBankAcc] = useState('');
  const [ifsc, setIfsc] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    if (selectedRole === 'seller') {
      updateSellerKYC({
        name,
        email,
        phone: mobile,
        pan: pan.toUpperCase(),
        bankAccount: {
          accountNumber: bankAcc,
          ifsc: ifsc.toUpperCase(),
          bankName: 'HDFC Bank Ltd',
          accountHolderName: name
        }
      });
      setRole('seller');
      toast.success('Seller Linked Account created on Razorpay Route!', { icon: '🏦' });
      navigate('/dashboard/seller');
    } else {
      setRole('buyer');
      toast.success('Buyer profile created! Ready to browse and bid.', { icon: '🎉' });
      navigate('/cars');
    }
  };

  return (
    <div className="section py-12 max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Join RevEscrow India</h1>
        <p className="text-xs text-slate-500">
          Peer-to-Peer marketplace with RBI-compliant Nodal Escrow & Automated Split Settlement
        </p>
      </div>

      {/* Role Picker */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-surface-100 rounded-2xl border border-surface-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setSelectedRole('seller')}
          className={`py-3 rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
            selectedRole === 'seller' ? 'bg-white text-brand-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>I want to Sell a Car</span>
          <span className="text-[10px] text-slate-400 font-normal">Creates Linked Account</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedRole('buyer')}
          className={`py-3 rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
            selectedRole === 'buyer' ? 'bg-white text-brand-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>I want to Buy / Bid</span>
          <span className="text-[10px] text-slate-400 font-normal">100% Escrow Protection</span>
        </button>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-200 shadow-sm space-y-5">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="As per PAN card"
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Mobile Number</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 98765 43210"
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Individual PAN</label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                placeholder="ABCDE1234F"
                className="input font-mono uppercase"
                required
              />
            </div>
          </div>

          {selectedRole === 'seller' && (
            <div className="p-4 bg-brand-50/60 rounded-xl border border-brand-200/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-900">
                <Landmark className="w-4 h-4 text-brand-600" />
                <span>Step A: Seller Linked Account Bank Details</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Direct payouts will settle here via Razorpay Route API after delivery confirmation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="label text-xs">Bank Account Number</label>
                  <input
                    type="text"
                    value={bankAcc}
                    onChange={(e) => setBankAcc(e.target.value)}
                    placeholder="e.g. 50100492819201"
                    className="input font-mono"
                    required={selectedRole === 'seller'}
                  />
                </div>

                <div>
                  <label className="label text-xs">Bank IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    placeholder="e.g. HDFC0000123"
                    className="input font-mono uppercase"
                    required={selectedRole === 'seller'}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button type="submit" className="btn btn-primary w-full py-3.5 font-bold shadow-md">
              <span>{selectedRole === 'seller' ? 'Create Seller Account with Penny Drop' : 'Create Free Buyer Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-surface-200">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
