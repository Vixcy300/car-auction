import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../data/cars';
import toast from 'react-hot-toast';
import { 
  Car, 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  Lock, 
  Landmark, 
  Sparkles,
  Info,
  ArrowRight,
  Gavel
} from 'lucide-react';

export default function ListCar() {
  const navigate = useNavigate();
  const { addCarListing, sellerUser, role, setRole } = useAuth();

  // Switch to seller role if user comes here
  React.useEffect(() => {
    if (role !== 'seller') {
      setRole('seller');
    }
  }, [role, setRole]);

  const [formData, setFormData] = useState({
    brand: 'Tata',
    model: 'Harrier',
    variant: 'XZ+ Dark Edition',
    year: 2023,
    price: 1850000,
    kilometers: 22000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    owner: '1st Owner',
    insurance: 'Comprehensive (Valid Dec 2027)',
    rto: 'MH04 (Thane)',
    color: 'Atlas Black',
    city: 'Mumbai',
    biddingEnabled: true,
    minBidIncrement: 15000,
    inspectionScore: 9.1,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    rcNumber: 'MH04DE8812',
    features: 'Panoramic Sunroof, 360 Camera, Ventilated Seats, JBL 9-Speaker Audio'
  });

  const price = Number(formData.price) || 0;
  const platformFee = Math.round(price * 0.05); // 5%
  const sellerNetPayout = price - platformFee;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.brand || !formData.model || !formData.price) {
      toast.error('Please fill in all mandatory vehicle details.');
      return;
    }

    const createdCar = addCarListing({
      title: `${formData.year} ${formData.brand} ${formData.model} ${formData.variant}`,
      brand: formData.brand,
      model: formData.model,
      variant: formData.variant,
      year: Number(formData.year),
      price: price,
      kilometers: Number(formData.kilometers),
      fuel: formData.fuel,
      transmission: formData.transmission,
      owner: formData.owner,
      insurance: formData.insurance,
      rto: formData.rto,
      color: formData.color,
      city: formData.city,
      biddingEnabled: formData.biddingEnabled,
      currentBid: formData.biddingEnabled ? price - 50000 : 0,
      minBidIncrement: Number(formData.minBidIncrement) || 10000,
      inspectionScore: Number(formData.inspectionScore) || 9.0,
      images: [
        formData.imageUrl,
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
      ],
      features: formData.features.split(',').map(f => f.trim()),
      inspectionSummary: {
        engine: 'Certified smooth, zero leaks, electronic diagnostics 100% pass',
        tyres: '75-80% life remaining',
        body: 'Factory original paint, no structural accidents',
        electricals: 'All electronics and sensors operational',
        rcStatus: `Parivahan verified (${formData.rcNumber})`
      }
    });

    toast.success('Car listed successfully with Escrow Protection!', {
      icon: '🚗',
      duration: 4000
    });

    navigate(`/cars/${createdCar.id}`);
  };

  return (
    <div className="section py-10 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="badge badge-blue text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            RBI Escrow Guaranteed Marketplace
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
          List Vehicle for Live Bidding & Auction
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Winning bid payout will be routed to your Razorpay Linked Account (<code>{sellerUser.linkedAccountId}</code>) upon buyer delivery confirmation.
        </p>
      </div>

      {/* Seller Bank Guarantee Card */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <Landmark className="w-6 h-6 text-emerald-700 shrink-0" />
          <div>
            <p className="font-bold text-emerald-950">
              Payout Destination: {sellerUser.bankAccount.bankName} (A/C: {sellerUser.bankAccount.accountNumber})
            </p>
            <p className="text-emerald-800">
              Penny-drop authenticated &bull; Sub-Merchant Linked Account ID: <code className="font-mono font-bold">{sellerUser.linkedAccountId}</code>
            </p>
          </div>
        </div>
        <span className="badge badge-green text-[10px] shrink-0">
          <CheckCircle2 className="w-3 h-3" />
          Verified
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Vehicle Identity */}
        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-surface-200 pb-3 flex items-center gap-2">
            <Car className="w-4 h-4 text-brand-600" />
            <span>1. Vehicle Identification & Basics</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Brand / Manufacturer</label>
              <select
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="input cursor-pointer"
              >
                <option>Tata</option>
                <option>Mahindra</option>
                <option>Hyundai</option>
                <option>Maruti Suzuki</option>
                <option>Honda</option>
                <option>Toyota</option>
                <option>Kia</option>
                <option>BMW</option>
                <option>Volkswagen</option>
                <option>Skoda</option>
              </select>
            </div>

            <div>
              <label className="label">Model Name</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g. Safari, XUV700, Creta"
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Variant / Trim</label>
              <input
                type="text"
                value={formData.variant}
                onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                placeholder="e.g. AX7 L, SX (O)"
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="label">Manufacturing Year</label>
              <input
                type="number"
                min="2010"
                max="2026"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Odometer (KM)</label>
              <input
                type="number"
                value={formData.kilometers}
                onChange={(e) => setFormData({ ...formData, kilometers: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Fuel Type</label>
              <select
                value={formData.fuel}
                onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                className="input cursor-pointer"
              >
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Hybrid (Petrol + EV)</option>
                <option>Electric (EV)</option>
                <option>CNG</option>
              </select>
            </div>

            <div>
              <label className="label">Transmission</label>
              <select
                value={formData.transmission}
                onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                className="input cursor-pointer"
              >
                <option>Automatic</option>
                <option>Manual</option>
                <option>iMT / Clutchless</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Registration RTO</label>
              <input
                type="text"
                value={formData.rto}
                onChange={(e) => setFormData({ ...formData, rto: e.target.value })}
                placeholder="e.g. MH02 (Mumbai West)"
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">RC Registration No.</label>
              <input
                type="text"
                value={formData.rcNumber}
                onChange={(e) => setFormData({ ...formData, rcNumber: e.target.value })}
                placeholder="e.g. MH04DE8812"
                className="input font-mono uppercase"
                required
              />
            </div>

            <div>
              <label className="label">City for Handover</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="input cursor-pointer"
              >
                <option>Mumbai</option>
                <option>Delhi NCR</option>
                <option>Bengaluru</option>
                <option>Pune</option>
                <option>Hyderabad</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Split Settlement Calculation */}
        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-surface-200 pb-3 flex items-center gap-2">
            <Gavel className="w-4 h-4 text-indigo-600" />
            <span>2. Auction Reserve & Bidding Parameters</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="label">Starting Reserve Bid (₹ INR)</label>
                <input
                  type="number"
                  step="5000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 1850000"
                  className="input font-mono font-bold text-lg"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Starting Bid: <strong>{formatINR(price)}</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs">Min. Bid Increment</label>
                  <select
                    value={formData.minBidIncrement}
                    onChange={(e) => setFormData({ ...formData, minBidIncrement: Number(e.target.value) })}
                    className="input cursor-pointer text-xs"
                  >
                    <option value={5000}>+₹5,000</option>
                    <option value={10000}>+₹10,000</option>
                    <option value={15000}>+₹15,000</option>
                    <option value={25000}>+₹25,000</option>
                  </select>
                </div>

                <div>
                  <label className="label text-xs">Auction Duration</label>
                  <select
                    className="input cursor-pointer text-xs"
                    defaultValue="3 Days"
                  >
                    <option>24 Hours</option>
                    <option>3 Days</option>
                    <option>5 Days</option>
                    <option>7 Days</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Live split math box */}
            <div className="bg-surface-50 p-4 rounded-xl border border-surface-200 text-xs space-y-2.5">
              <span className="font-bold text-slate-700 block uppercase tracking-wider text-[11px]">
                Estimated Winning Bid Payout
              </span>

              <div className="flex justify-between text-slate-600">
                <span>Reserve Winning Bid:</span>
                <strong className="text-slate-900">{formatINR(price)}</strong>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Platform Commission (5%):</span>
                <span>{formatINR(platformFee)}</span>
              </div>

              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>GST (18% on fee):</span>
                <span>{formatINR(Math.round(platformFee * 0.18))} (Covered)</span>
              </div>

              <div className="pt-2 border-t border-surface-200 flex justify-between font-bold text-emerald-800 text-sm">
                <span>Net Direct Bank Payout:</span>
                <span>{formatINR(sellerNetPayout)}</span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                Winning bids are held in nodal escrow during inspection and automatically split to your linked bank account within T+1 days of delivery confirmation.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Photos and Features */}
        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-surface-200 pb-3 flex items-center gap-2">
            <Upload className="w-4 h-4 text-brand-600" />
            <span>3. Photos & Standout Features</span>
          </h2>

          <div>
            <label className="label">Vehicle Photo URL (High Resolution)</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="input text-xs"
              required
            />
          </div>

          <div>
            <label className="label">Key Equipment & Accessories (Comma-separated)</label>
            <textarea
              rows="3"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="input"
              placeholder="e.g. Sunroof, Leather Seats, 360 Camera, ADAS"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="btn btn-primary w-full py-4 text-base font-bold shadow-xl shadow-brand-500/20"
          >
            <span>Publish Live Auction with Escrow Protection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
