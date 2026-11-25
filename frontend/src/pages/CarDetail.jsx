import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatLakhs, formatINR, initialListings } from '../data/cars';
import EscrowShieldBadge from '../components/EscrowShieldBadge';
import toast from 'react-hot-toast';
import { 
  ShieldCheck, 
  Car, 
  Calendar, 
  Gauge, 
  Fuel, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Lock, 
  FileCheck2, 
  ArrowRight, 
  Gavel, 
  UserCheck, 
  Building2, 
  Info,
  ChevronLeft,
  Share2,
  Clock,
  Sparkles
} from 'lucide-react';

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, placeBid } = useAuth();
  
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
      bankName: "HDFC Bank (A/C: ****4892)",
      memberSince: "Jan 2024",
      rating: 4.9,
      dealsCompleted: 5
    },
    features: rawCar.features || ["Authentic item", "Inspected condition", "Form 29/30 transfer assistance"],
    inspectionSummary: rawCar.inspectionSummary || {
      engine: "Operational and tested, flawless functioning",
      tyres: "Inspected and certified in good condition",
      body: "Original finish, matching listing photos",
      rcStatus: "Verified on national registry database"
    }
  } : null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [customBidAmount, setCustomBidAmount] = useState('');

  if (!car) {
    return (
      <div className="section py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Car Not Found</h2>
        <p className="text-slate-500 mt-2">The listing you are looking for does not exist or has been removed.</p>
        <Link to="/cars" className="btn btn-primary mt-6 inline-flex">
          Browse All Cars
        </Link>
      </div>
    );
  }

  const effectivePrice = car.biddingEnabled ? car.currentBid : car.price;
  const platformFee = Math.round(effectivePrice * 0.05); // 5%
  const sellerPayout = effectivePrice - platformFee;
  const minNextBid = (car.currentBid || car.price) + (car.minBidIncrement || 15000);

  const handleBidSubmit = (e) => {
    e.preventDefault();
    const bidValue = Number(customBidAmount);
    if (!bidValue || bidValue < minNextBid) {
      toast.error(`Minimum next bid is ${formatINR(minNextBid)}`);
      return;
    }
    placeBid(car.id, bidValue);
    setBidModalOpen(false);
    setCustomBidAmount('');
  };

  return (
    <div className="section py-8 space-y-8">
      {/* Back button & breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Listings</span>
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              toast.success('Listing link copied to clipboard!');
            }}
            className="btn btn-outline btn-sm text-xs"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery + Escrow Purchase Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Photos & Details (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Photo Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden shadow-card border border-surface-200">
              <img
                src={car.images[activeImageIndex] || car.images[0]}
                alt={car.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="badge badge-blue shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  RBI Nodal Escrow Covered
                </span>
                <span className="badge badge-slate shadow-md bg-black/70 text-white border-0">
                  {car.city}
                </span>
              </div>
            </div>

            {/* Thumbnail selector */}
            {car.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {car.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'border-brand-600 ring-2 ring-brand-200' : 'border-surface-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Key Highlights */}
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span>Listing ID: {car.id}</span>
                <span>&bull;</span>
                <span>{car.rto}</span>
                <span>&bull;</span>
                <span>{car.owner}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {car.title}
              </h1>
              <p className="text-sm text-slate-500 font-medium">{car.variant}</p>
            </div>

            {/* Spec Icons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-surface-200">
              <div className="p-3 bg-surface-50 rounded-xl">
                <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Reg. Year
                </p>
                <p className="text-base font-bold text-slate-800 mt-0.5">{car.year}</p>
              </div>

              <div className="p-3 bg-surface-50 rounded-xl">
                <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-slate-400" />
                  Kilometers
                </p>
                <p className="text-base font-bold text-slate-800 mt-0.5">{car.kilometers.toLocaleString('en-IN')} km</p>
              </div>

              <div className="p-3 bg-surface-50 rounded-xl">
                <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Fuel className="w-3.5 h-3.5 text-slate-400" />
                  Fuel Type
                </p>
                <p className="text-base font-bold text-slate-800 mt-0.5">{car.fuel}</p>
              </div>

              <div className="p-3 bg-surface-50 rounded-xl">
                <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  Transmission
                </p>
                <p className="text-base font-bold text-slate-800 mt-0.5">{car.transmission}</p>
              </div>
            </div>
          </div>

          {/* Detailed Features */}
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Key Equipment & Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {car.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-surface-50 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inspection Report Summary */}
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Vehicle Inspection Report</h3>
                <p className="text-xs text-slate-500">200-Point checklist certified by independent inspection engineers</p>
              </div>
              <div className="text-right">
                <span className="badge badge-green text-sm px-3 py-1 font-bold">
                  {car.inspectionScore} / 10
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 bg-surface-50 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Engine & Powertrain:</strong>
                  <p className="text-slate-600 mt-0.5">{car.inspectionSummary.engine}</p>
                </div>
              </div>

              <div className="p-3 bg-surface-50 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Tyres & Suspension:</strong>
                  <p className="text-slate-600 mt-0.5">{car.inspectionSummary.tyres}</p>
                </div>
              </div>

              <div className="p-3 bg-surface-50 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Body & Paint Condition:</strong>
                  <p className="text-slate-600 mt-0.5">{car.inspectionSummary.body}</p>
                </div>
              </div>

              <div className="p-3 bg-surface-50 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Parivahan RC Database Status:</strong>
                  <p className="text-slate-600 mt-0.5">{car.inspectionSummary.rcStatus}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Escrow Checkout Card & Seller Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* Main Buy & Escrow Card */}
          <div className="card p-6 border-brand-200 shadow-card-hover relative overflow-hidden bg-gradient-to-b from-white to-surface-50">
            <div className="flex items-center justify-between pb-4 border-b border-surface-200 mb-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Gavel className="w-3.5 h-3.5 text-indigo-600" />
                  Current Winning Bid
                </span>
                <p className="text-3xl font-black text-slate-900 mt-1">
                  {formatLakhs(effectivePrice)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Exact: {formatINR(effectivePrice)}</p>
              </div>

              <span className="badge badge-red font-bold text-xs px-2.5 py-1 shadow-xs flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />
                <span>Live Auction &bull; {car.bids || 12} bids</span>
              </span>
            </div>

            {/* Split Settlement math explainer */}
            <div className="bg-brand-50/70 rounded-xl p-3.5 border border-brand-100 text-xs space-y-2 mb-5">
              <div className="flex items-center justify-between text-slate-600">
                <span>Winning Bid Total</span>
                <strong className="text-slate-900">{formatINR(effectivePrice)}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Platform Commission (5%)</span>
                <span>{formatINR(platformFee)}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-brand-900 pt-1.5 border-t border-brand-200/60">
                <span>Seller Payout on Delivery</span>
                <span>{formatINR(sellerPayout)}</span>
              </div>
              <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3 text-brand-600 shrink-0" />
                <span>Locked via Razorpay Route (<code className="text-brand-800">on_hold: 1</code>)</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setBidModalOpen(true)}
                className="btn btn-primary w-full py-3.5 text-base font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <Gavel className="w-4 h-4 text-white" />
                <span>Place Higher Bid (Min: {formatINR(minNextBid)})</span>
              </button>

              <Link
                to={`/checkout/${car.id}`}
                className="btn btn-outline w-full py-3 text-sm font-semibold text-slate-700 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-indigo-600" />
                <span>Win & Lock in Escrow</span>
              </Link>
            </div>

            {/* High value note */}
            <p className="text-[11px] text-slate-500 text-center mt-4">
              UPI capped at ₹1,00,000. Netbanking and RTGS Virtual Escrow accounts enabled for full payment.
            </p>
          </div>

          {/* Seller Verified Identity Card */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-200 pb-3">
              <h4 className="font-bold text-slate-900 text-sm">Verified Private Seller</h4>
              <span className="badge badge-green text-[11px]">
                <CheckCircle2 className="w-3 h-3" />
                KYC Completed
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-base">
                {car.seller.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{car.seller.name}</p>
                <p className="text-xs text-slate-500">{car.seller.city} &bull; Member since {car.seller.memberSince}</p>
                <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold mt-0.5">
                  <span>★ {car.seller.rating}</span>
                  <span className="text-slate-400 font-normal">({car.seller.dealsCompleted} completed handovers)</span>
                </div>
              </div>
            </div>

            {/* Linked Account info from Document */}
            <div className="bg-surface-50 rounded-xl p-3 text-xs space-y-1.5 border border-surface-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Razorpay Linked Acc:</span>
                <code className="font-mono font-bold text-brand-700">{car.seller.linkedAccountId}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Individual PAN:</span>
                <span className="font-mono font-medium text-slate-700">{car.seller.pan.substring(0, 5)}••••</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank Verification:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Penny-Drop Verified
                </span>
              </div>
            </div>
          </div>

          {/* Delivery & Inspection Checklist */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
            <h5 className="font-bold text-sm flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              Buyer Protection Checklist
            </h5>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">&bull;</span>
                <span>You will test drive and examine the car in person before handover.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">&bull;</span>
                <span>Verify original RC and Form 29/30 signing by the owner.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">&bull;</span>
                <span>Funds only leave escrow when you tap "Confirm Delivery" on your app.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      {bidModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-200 animate-slide-up space-y-5">
            <div className="flex items-center justify-between border-b border-surface-200 pb-3">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-slate-900 text-lg">Place Live Bid</h3>
              </div>
              <button
                onClick={() => setBidModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-500">Vehicle:</p>
              <p className="text-sm font-bold text-slate-800">{car.title}</p>
            </div>

            <div className="p-3 bg-surface-50 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Current Highest Bid:</span>
                <strong className="text-slate-900">{formatINR(car.currentBid)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Minimum Bid Increment:</span>
                <span className="font-semibold text-brand-700">+{formatINR(car.minBidIncrement)}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-surface-200 text-slate-900">
                <span>Minimum Allowed Bid:</span>
                <span>{formatINR(minNextBid)}</span>
              </div>
            </div>

            <form onSubmit={handleBidSubmit} className="space-y-4">
              <div>
                <label className="label">Enter Your Bid Amount (₹ INR)</label>
                <input
                  type="number"
                  min={minNextBid}
                  step={car.minBidIncrement}
                  value={customBidAmount}
                  onChange={(e) => setCustomBidAmount(e.target.value)}
                  placeholder={`e.g. ${minNextBid}`}
                  className="input font-mono font-bold text-base"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setBidModalOpen(false)}
                  className="btn btn-outline flex-1 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 py-2.5"
                >
                  Confirm & Submit Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
