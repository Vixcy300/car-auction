import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { setRole, buyerUser, sellerUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    toast.success('Signed in successfully!');
    navigate('/cars');
  };

  const handleQuickLogin = (roleType) => {
    setRole(roleType);
    if (roleType === 'buyer') {
      setEmail(buyerUser.email);
      toast.success(`Logged in as Buyer: ${buyerUser.name}`);
      navigate('/dashboard/buyer');
    } else {
      setEmail(sellerUser.email);
      toast.success(`Logged in as Seller: ${sellerUser.name}`);
      navigate('/dashboard/seller');
    }
  };

  return (
    <div className="section py-16 max-w-md mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-2">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Welcome Back to RevEscrow</h1>
        <p className="text-xs text-slate-500">Sign in to manage your car deals and nodal escrow orders</p>
      </div>

      {/* Quick Demo One-Click Access Buttons */}
      <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-200/80 space-y-2.5">
        <span className="text-[11px] font-bold text-brand-800 uppercase tracking-wider block text-center">
          ⚡ One-Click Demo Personas
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickLogin('buyer')}
            className="p-2.5 bg-white rounded-xl border border-brand-200 hover:border-brand-400 font-semibold text-slate-800 flex flex-col items-center justify-center gap-1 shadow-2xs cursor-pointer"
          >
            <span className="text-brand-600 font-bold">Buyer Account</span>
            <span className="text-[10px] text-slate-500">Arjun Verma</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('seller')}
            className="p-2.5 bg-white rounded-xl border border-brand-200 hover:border-brand-400 font-semibold text-slate-800 flex flex-col items-center justify-center gap-1 shadow-2xs cursor-pointer"
          >
            <span className="text-emerald-700 font-bold">Seller (Linked Acc)</span>
            <span className="text-[10px] text-slate-500">Vikramaditya Rao</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm space-y-5">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label">Registered Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="input pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input pl-10"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full py-3 font-bold">
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-surface-200">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:underline">
            Register for Free
          </Link>
        </div>
      </div>
    </div>
  );
}
