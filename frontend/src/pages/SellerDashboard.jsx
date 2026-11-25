import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatLakhs, formatINR } from '../data/cars';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Building2, 
  Landmark, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Lock, 
  PlusCircle, 
  Car, 
  FileText, 
  Receipt, 
  ArrowUpRight, 
  ExternalLink,
  AlertCircle,
  HelpCircle,
  Settings
} from 'lucide-react';

export default function SellerDashboard() {
  const { sellerUser, cars, orders, updateSellerKYC } = useAuth();

  const [editKycModal, setEditKycModal] = useState(false);
  const [bankAccNumber, setBankAccNumber] = useState(sellerUser.bankAccount.accountNumber);
  const [ifscCode, setIfscCode] = useState(sellerUser.bankAccount.ifsc);
  const [panNumber, setPanNumber] = useState(sellerUser.pan);

  // Filter cars and orders belonging to this seller
  const sellerCars = cars.filter(c => c.seller?.id === sellerUser.id || c.seller?.linkedAccountId === sellerUser.linkedAccountId);
  const sellerOrders = orders.filter(o => o.sellerLinkedAccount === sellerUser.linkedAccountId || o.sellerName === sellerUser.name);

  // Escrow balance calculation
  const fundsInEscrow = sellerOrders
    .filter(o => o.status === 'PAID_IN_ESCROW')
    .reduce((acc, curr) => acc + (curr.sellerPayoutAmount || 0), 0);

  const totalSettled = sellerOrders
    .filter(o => o.status === 'HANDOVER_CONFIRMED' || o.status === 'SETTLED')
    .reduce((acc, curr) => acc + (curr.sellerPayoutAmount || 0), 0);

  const totalCommissionPaid = sellerOrders
    .reduce((acc, curr) => acc + (curr.commissionPaise ? curr.commissionPaise / 100 : 0), 0);

  const handleKycSave = (e) => {
    e.preventDefault();
    updateSellerKYC({
      pan: panNumber.toUpperCase(),
      bankAccount: {
        accountNumber: bankAccNumber,
        ifsc: ifscCode.toUpperCase(),
        bankName: 'Verified Bank',
        accountHolderName: sellerUser.name,
      }
    });
    setEditKycModal(false);
  };

  return (
    <div className="section py-8 space-y-8">
      {/* Top Seller Overview Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-surface-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-brand-500/20 shrink-0">
            {sellerUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{sellerUser.name}</h1>
              <span className="badge badge-green text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Linked Account Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Gateway ID: <code className="font-mono text-brand-700 font-bold">{sellerUser.linkedAccountId}</code> &bull; Sub-Merchant Profile
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditKycModal(true)}
            className="btn btn-outline btn-sm text-xs"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Bank & KYC Settings</span>
          </button>
          <Link to="/sell" className="btn btn-primary btn-sm text-xs font-bold">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create New Auction</span>
          </Link>
        </div>
      </div>

      {/* ── METRICS TILES ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: In Escrow */}
        <div className="bg-white p-5 rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium">Funds in Escrow</span>
            <Lock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{formatINR(fundsInEscrow)}</p>
          <p className="text-[11px] text-amber-700 font-medium mt-1">
            Held pending buyer delivery confirmation
          </p>
        </div>

        {/* Metric 2: Settled to Bank */}
        <div className="bg-white p-5 rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium">Direct Bank Settlements</span>
            <Landmark className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{formatINR(totalSettled)}</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            Settled via Razorpay Route (T+1)
          </p>
        </div>

        {/* Metric 3: Active Listings */}
        <div className="bg-white p-5 rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium">Active Auctions Listed</span>
            <Car className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{sellerCars.length}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Live for public bidding
          </p>
        </div>

        {/* Metric 4: Platform Fee & Tax */}
        <div className="bg-white p-5 rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium">Processing Fee (5%)</span>
            <Receipt className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{formatINR(totalCommissionPaid)}</p>
          <p className="text-[11px] text-purple-700 font-medium mt-1">
            Includes 18% GST tax invoice
          </p>
        </div>
      </div>

      {/* ── SELLER ONBOARDING & LINKED ACCOUNT STATUS (STEP A FROM DOC) ── */}
      <div className="card p-6 bg-gradient-to-r from-surface-50 to-white border-surface-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-blue text-xs">
                <Building2 className="w-3.5 h-3.5" />
                Step A: Sub-Merchant Architecture
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Gateway Linked Account Profile (<code className="text-brand-700">{sellerUser.linkedAccountId}</code>)
            </h3>
            <p className="text-xs text-slate-500">
              Direct payout destination configured on Razorpay Route / Cashfree Easy Split
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Penny-Drop Bank Verification Succeeded</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-5 text-xs">
          <div className="p-3 bg-white rounded-xl border border-surface-200">
            <p className="text-slate-400 text-[11px]">Beneficiary Name</p>
            <p className="font-bold text-slate-800 mt-0.5">{sellerUser.name}</p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-surface-200">
            <p className="text-slate-400 text-[11px]">Individual PAN</p>
            <p className="font-mono font-bold text-slate-800 mt-0.5">{sellerUser.pan}</p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-surface-200">
            <p className="text-slate-400 text-[11px]">Bank Account</p>
            <p className="font-mono font-bold text-slate-800 mt-0.5">{sellerUser.bankAccount.accountNumber}</p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-surface-200">
            <p className="text-slate-400 text-[11px]">IFSC Code</p>
            <p className="font-mono font-bold text-slate-800 mt-0.5">{sellerUser.bankAccount.ifsc}</p>
          </div>
        </div>
      </div>

      {/* ── INCOMING ORDERS & ESCROW TRANSACTIONS ── */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Incoming Deals & Payout Schedule</h2>
        
        {sellerOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-surface-200 text-center">
            <p className="text-slate-500 text-sm">No incoming deals yet on your vehicle listings.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sellerOrders.map(order => (
              <div key={order.orderId} className="card p-6 border-surface-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.carImage}
                      alt={order.carTitle}
                      className="w-16 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`badge text-[10px] ${order.status === 'PAID_IN_ESCROW' ? 'badge-amber' : 'badge-green'}`}>
                          {order.status === 'PAID_IN_ESCROW' ? 'FUNDS SECURED IN ESCROW' : 'SETTLED TO BANK'}
                        </span>
                        <span className="text-xs text-slate-400">Order: {order.orderId}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">{order.carTitle}</h4>
                      <p className="text-xs text-slate-500">
                        Buyer: <strong>{order.buyerName}</strong> ({order.buyerPhone})
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-400">Your Net Payout (95%)</p>
                    <p className="text-xl font-black text-emerald-700">{formatINR(order.sellerPayoutAmount)}</p>
                    <p className="text-[10px] text-slate-400">Platform fee: {formatINR(order.commissionPaise / 100)}</p>
                  </div>
                </div>

                {order.status === 'PAID_IN_ESCROW' ? (
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/80 text-xs flex items-center justify-between gap-4 text-amber-900">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        Buyer has paid into Nodal Escrow (<code className="font-mono font-bold">on_hold: 1</code>). Please arrange vehicle inspection and handover with <strong>{order.buyerName}</strong>.
                      </span>
                    </div>
                    <span className="badge badge-amber text-[10px] shrink-0">Awaiting Handover</span>
                  </div>
                ) : (
                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between text-emerald-900">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Handover confirmed! Funds released and credited to your verified bank account.</span>
                    </div>
                    <button 
                      onClick={() => toast.success(`GST Invoice INV-2026-${order.orderId.slice(-4)} downloaded!`)}
                      className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>GST Invoice</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MY ACTIVE CAR LISTINGS ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">My Vehicle Inventory</h2>
          <Link to="/sell" className="btn btn-outline btn-sm text-xs">
            + Add New Listing
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellerCars.map(car => (
            <div key={car.id} className="card flex flex-col justify-between">
              <div>
                <img
                  src={car.images[0]}
                  alt={car.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="badge badge-slate">{car.rto}</span>
                    <span className="text-slate-400">{car.kilometers.toLocaleString('en-IN')} km</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{car.title}</h4>
                  <p className="text-xs text-slate-500">{car.variant}</p>
                  <p className="text-base font-extrabold text-slate-900 pt-1">
                    {formatLakhs(car.biddingEnabled ? car.currentBid : car.price)}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-surface-200 flex justify-between items-center text-xs">
                <span className="badge badge-green text-[10px]">Active</span>
                <Link to={`/cars/${car.id}`} className="text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1">
                  <span>View Public Page</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit KYC Modal */}
      {editKycModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-200 animate-slide-up space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Update Payout Bank Details</h3>
            <p className="text-xs text-slate-500">
              This triggers a penny-drop verification via Razorpay Route API before activating the linked account.
            </p>

            <form onSubmit={handleKycSave} className="space-y-3 text-xs">
              <div>
                <label className="label">Bank Account Number</label>
                <input
                  type="text"
                  value={bankAccNumber}
                  onChange={(e) => setBankAccNumber(e.target.value)}
                  className="input font-mono"
                  required
                />
              </div>

              <div>
                <label className="label">IFSC Code</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="input font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="label">Individual PAN</label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  className="input font-mono uppercase"
                  required
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditKycModal(false)}
                  className="btn btn-outline flex-1 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 py-2 text-xs font-bold"
                >
                  Verify via Penny Drop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
