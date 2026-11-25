import React from 'react';
import { ShieldCheck, Lock, Landmark, RefreshCw, FileText } from 'lucide-react';

export default function EscrowShieldBadge({ compact = false }) {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/80 rounded-full text-xs font-semibold text-brand-700">
        <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
        <span>RBI-Compliant Nodal Escrow Protected</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-brand-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Background glowing ambient light */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-brand-300">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                  RBI PA/PG Compliant
                </span>
                <span className="text-xs text-slate-400">Razorpay Route Enabled</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">Split-Settlement Escrow Protection</h3>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-400">Platform Safety Status</p>
            <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Nodal Account Active
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-brand-300 mb-2">
              <Lock className="w-4 h-4 text-brand-400" />
              <h4 className="font-semibold text-sm text-white">100% Funds on Hold</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your money rests in an RBI-regulated nodal escrow account (<code className="text-amber-300 font-mono">on_hold: 1</code>). Not a rupee is released until you physically inspect the vehicle and approve delivery.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-emerald-300 mb-2">
              <Landmark className="w-4 h-4 text-emerald-400" />
              <h4 className="font-semibold text-sm text-white">Direct Split Settlement</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Automated API transfers route 95% net payout straight to the seller's verified linked bank account and 5% platform commission to our current account. Zero manual pooling.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-purple-300 mb-2">
              <RefreshCw className="w-4 h-4 text-purple-400" />
              <h4 className="font-semibold text-sm text-white">Pre-Handover Refund</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If inspection fails or vehicle condition mismatches description, our backend instantly reverses the held transfer and refunds you 100% via payment gateway API.
            </p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Facilitator under Section 79 of IT Act. 18% GST invoiced on platform commission.</span>
          </div>
          <span className="text-slate-300 font-medium">Penny-Drop Verified Bank Accounts Only</span>
        </div>
      </div>
    </div>
  );
}
