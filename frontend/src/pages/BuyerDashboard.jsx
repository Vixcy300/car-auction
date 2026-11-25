import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatLakhs, formatINR } from '../data/cars';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Car, 
  Clock, 
  Landmark, 
  ArrowRight, 
  RotateCcw,
  KeyRound,
  FileCheck2,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';

export default function BuyerDashboard() {
  const { buyerUser, orders, cars, releaseEscrowFunds, cancelAndRefund } = useAuth();

  const [confirmDeliveryModal, setConfirmDeliveryModal] = useState(null);
  const [cancelModal, setCancelModal] = useState(null);

  const activeEscrowOrders = orders.filter(o => o.status === 'PAID_IN_ESCROW');
  const pastOrders = orders.filter(o => o.status !== 'PAID_IN_ESCROW');

  const handleConfirmRelease = (orderId) => {
    releaseEscrowFunds(orderId);
    setConfirmDeliveryModal(null);
  };

  const handleCancelDeal = (orderId) => {
    cancelAndRefund(orderId);
    setCancelModal(null);
  };

  return (
    <div className="section py-8 space-y-8">
      {/* Header Profile Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-surface-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-700 font-extrabold text-2xl flex items-center justify-center shrink-0">
            {buyerUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{buyerUser.name}</h1>
              <span className="badge badge-green text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Buyer KYC
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              PAN: <span className="font-mono">{buyerUser.pan}</span> &bull; {buyerUser.email} &bull; {buyerUser.phone}
            </p>
          </div>
        </div>

        {/* Escrow summary pill */}
        <div className="flex gap-4 p-3 bg-surface-50 rounded-xl border border-surface-200 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Funds in Escrow:</span>
            <p className="text-base font-extrabold text-brand-700">
              {formatINR(activeEscrowOrders.reduce((acc, curr) => acc + curr.totalAmount, 0))}
            </p>
          </div>
          <div className="border-l border-surface-200 pl-4">
            <span className="text-slate-400 font-medium">Active Transactions:</span>
            <p className="text-base font-extrabold text-slate-800">{activeEscrowOrders.length}</p>
          </div>
        </div>
      </div>

      {/* ── ACTIVE ORDERS IN ESCROW (STEP D WORKFLOW) ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-600" />
              <span>Active Winning Bids Held in Escrow</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Winning bid funds will not move to the seller until you inspect the item and click "Confirm Delivery".
            </p>
          </div>
        </div>

        {activeEscrowOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-surface-200 text-center space-y-3">
            <p className="text-slate-600 text-sm">You have no active orders currently held in escrow.</p>
            <Link to="/cars" className="btn btn-primary btn-sm inline-flex">
              Explore Cars to Buy
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {activeEscrowOrders.map(order => (
              <div key={order.orderId} className="card p-6 border-brand-200 shadow-card-hover space-y-6">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200">
                  <div className="flex gap-4 items-center">
                    <img
                      src={order.carImage}
                      alt={order.carTitle}
                      className="w-20 h-14 rounded-xl object-cover border border-surface-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-amber text-xs font-bold animate-pulse">
                          <Lock className="w-3 h-3" />
                          PAID_IN_ESCROW
                        </span>
                        <span className="text-xs text-slate-400">Order: {order.orderId}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base mt-1">{order.carTitle}</h3>
                      <p className="text-xs text-slate-500">
                        Seller: <strong>{order.sellerName}</strong> (Sub-Merchant: <code className="text-brand-700">{order.sellerLinkedAccount}</code>)
                      </p>
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:border-surface-200 sm:pl-6">
                    <span className="text-xs text-slate-400">Total Held in Escrow</span>
                    <p className="text-2xl font-black text-slate-900">{formatINR(order.totalAmount)}</p>
                    <p className="text-[11px] text-emerald-700 font-mono font-medium">on_hold: true</p>
                  </div>
                </div>

                {/* Escrow Timeline (Visual state machine) */}
                <div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
                    Escrow Life-Cycle State
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    {order.timeline.map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border transition-all ${
                          step.done
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                            : 'bg-surface-50 border-surface-200 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs">{step.step}</span>
                          {step.done ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-slate-500">{step.time}</p>
                        <p className="text-[11px] mt-1 text-slate-600 leading-tight">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Handover & Action Buttons (Step D) */}
                <div className="p-4 bg-brand-50/60 rounded-xl border border-brand-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <KeyRound className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Physical Delivery & Inspection Complete?</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Tapping "Confirm Delivery" executes Razorpay Route release (<code className="text-brand-800">PATCH /transfers/{order.transferId} on_hold: 0</code>) and settles ₹ to the seller.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => setCancelModal(order)}
                      className="btn btn-outline btn-sm text-xs text-red-600 hover:bg-red-50 flex-1 sm:flex-initial"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Cancel & Refund</span>
                    </button>

                    <button
                      onClick={() => setConfirmDeliveryModal(order)}
                      className="btn btn-primary btn-sm text-xs font-bold flex-1 sm:flex-initial shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Confirm Delivery & Release</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── PAST ORDERS / SETTLED TRANSACTIONS ── */}
      {pastOrders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Past Completed Deals</h2>
          <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-surface-200">
              {pastOrders.map(order => (
                <div key={order.orderId} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.carImage}
                      alt={order.carTitle}
                      className="w-16 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{order.carTitle}</h4>
                      <p className="text-xs text-slate-400">Order ID: {order.orderId} &bull; Seller: {order.sellerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{formatINR(order.totalAmount)}</p>
                      <span className={`badge text-[10px] ${order.status === 'HANDOVER_CONFIRMED' ? 'badge-green' : 'badge-slate'}`}>
                        {order.status === 'HANDOVER_CONFIRMED' ? 'DELIVERY COMPLETED' : order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delivery Modal */}
      {confirmDeliveryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-surface-200 animate-slide-up space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Confirm Delivery & Release Escrow</h3>
              <p className="text-xs text-slate-500 mt-1">
                This triggers the final payout to the seller's verified bank account.
              </p>
            </div>

            <div className="p-4 bg-surface-50 rounded-xl text-xs space-y-2 border border-surface-200 text-slate-700">
              <div className="font-semibold text-slate-900 mb-1">Please confirm:</div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>You have physically inspected the car</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>You received the car keys and original RC book</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Form 29 & 30 signed by the registered owner</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmDeliveryModal(null)}
                className="btn btn-outline flex-1 py-2.5 text-xs"
              >
                Go Back
              </button>
              <button
                onClick={() => handleConfirmRelease(confirmDeliveryModal.orderId)}
                className="btn btn-primary flex-1 py-2.5 text-xs font-bold"
              >
                Release ₹{confirmDeliveryModal.sellerPayoutAmount.toLocaleString('en-IN')} to Seller
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-surface-200 animate-slide-up space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Cancel Deal & Reversal</h3>
              <p className="text-xs text-slate-500 mt-1">
                Because funds are currently held (<code className="text-slate-700">on_hold: 1</code>), our backend will immediately execute a 100% gateway refund.
              </p>
            </div>

            <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs">
              <p>
                <strong>Full refund of {formatINR(cancelModal.totalAmount)}</strong> will be processed to your source account within 2-4 business days.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCancelModal(null)}
                className="btn btn-outline flex-1 py-2.5 text-xs"
              >
                Keep Deal Active
              </button>
              <button
                onClick={() => handleCancelDeal(cancelModal.orderId)}
                className="btn btn-danger flex-1 py-2.5 text-xs font-bold"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
