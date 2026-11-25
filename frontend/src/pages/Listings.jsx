import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatLakhs } from '../data/cars';
import { 
  Search, 
  SlidersHorizontal, 
  ShieldCheck, 
  Gavel, 
  Calendar, 
  Gauge, 
  Fuel, 
  MapPin, 
  Award,
  ArrowRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function Listings() {
  const { cars } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState(searchParams.get('fuel') || 'All');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All');
  const [biddingOnly, setBiddingOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Filter cars
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      // Query filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = car.title.toLowerCase().includes(q);
        const matchesBrand = car.brand.toLowerCase().includes(q);
        const matchesModel = car.model.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBrand && !matchesModel) return false;
      }

      // Brand filter
      if (selectedBrand !== 'All' && car.brand !== selectedBrand) return false;

      // Fuel filter
      if (selectedFuel !== 'All' && !car.fuel.toLowerCase().includes(selectedFuel.toLowerCase())) return false;

      // City filter
      if (selectedCity !== 'All' && car.city !== selectedCity) return false;

      // Bidding only
      if (biddingOnly && !car.biddingEnabled) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return (a.currentBid || a.price) - (b.currentBid || b.price);
      if (sortBy === 'price-desc') return (b.currentBid || b.price) - (a.currentBid || a.price);
      if (sortBy === 'km-asc') return a.kilometers - b.kilometers;
      if (sortBy === 'score-desc') return b.inspectionScore - a.inspectionScore;
      return b.year - a.year; // newest default
    });
  }, [cars, searchQuery, selectedBrand, selectedFuel, selectedCity, biddingOnly, sortBy]);

  const brands = ['All', 'Mahindra', 'Hyundai', 'Tata', 'Honda', 'Maruti Suzuki', 'BMW'];
  const fuels = ['All', 'Petrol', 'Diesel', 'Hybrid'];
  const cities = ['All', 'Mumbai', 'Delhi NCR', 'Bengaluru', 'Pune', 'Hyderabad'];

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('All');
    setSelectedFuel('All');
    setSelectedCity('All');
    setBiddingOnly(false);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="section py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-blue text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Escrow Secured
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
            Explore Verified P2P Used Cars
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Showing {filteredCars.length} vehicles backed by RBI-compliant nodal escrow protection
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/sell" className="btn btn-primary btn-sm">
            <span>+ List Your Vehicle</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-surface-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Text search */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by make, model, variant..."
              className="input pl-10"
            />
          </div>

          {/* Brand select */}
          <div className="sm:col-span-2">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="input cursor-pointer"
            >
              {brands.map(b => (
                <option key={b} value={b}>{b === 'All' ? 'All Brands' : b}</option>
              ))}
            </select>
          </div>

          {/* Fuel select */}
          <div className="sm:col-span-2">
            <select
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="input cursor-pointer"
            >
              {fuels.map(f => (
                <option key={f} value={f}>{f === 'All' ? 'All Fuel Types' : f}</option>
              ))}
            </select>
          </div>

          {/* City select */}
          <div className="sm:col-span-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="input cursor-pointer"
            >
              {cities.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Locations' : c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Second row toggles & sorting */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-surface-200 text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 select-none">
              <input
                type="checkbox"
                checked={biddingOnly}
                onChange={(e) => setBiddingOnly(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-400 border-slate-300"
              />
              <span className="flex items-center gap-1.5">
                <Gavel className="w-3.5 h-3.5 text-red-500" />
                Live Auctions Only
              </span>
            </label>

            <button
              onClick={resetFilters}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input !w-auto !py-1 !px-2.5 text-xs cursor-pointer"
            >
              <option value="newest">Year: Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="km-asc">Kilometers: Lowest</option>
              <option value="score-desc">Inspection Score: Highest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Car Grid */}
      {filteredCars.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-200 p-8">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No cars found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            We couldn't find any vehicles matching your criteria. Try adjusting filters or searching a different term.
          </p>
          <button onClick={resetFilters} className="btn btn-outline btn-sm mt-5">
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map(car => (
            <div key={car.id} className="card card-hover flex flex-col group">
              {/* Image banner */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={car.images[0]}
                  alt={car.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {car.biddingEnabled ? (
                    <span className="badge badge-red shadow-sm">
                      <Gavel className="w-3 h-3" />
                      Live Bidding
                    </span>
                  ) : (
                    <span className="badge badge-green shadow-sm">
                      Fixed Price
                    </span>
                  )}
                  <span className="badge badge-slate shadow-sm bg-black/60 text-white border-0">
                    {car.city}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Score {car.inspectionScore}/10</span>
                </div>

                {car.status === 'IN_ESCROW' && (
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center">
                    <span className="bg-amber-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Locked in Escrow
                    </span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>{car.rto}</span>
                    <span>{car.owner}</span>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1 text-base">
                    {car.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{car.variant}</p>

                  {/* Spec pills */}
                  <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-surface-200 text-center text-xs text-slate-600">
                    <div className="bg-surface-50 p-1.5 rounded-lg">
                      <p className="text-[10px] text-slate-400 font-medium">Year</p>
                      <p className="font-semibold text-slate-800">{car.year}</p>
                    </div>
                    <div className="bg-surface-50 p-1.5 rounded-lg">
                      <p className="text-[10px] text-slate-400 font-medium">Mileage</p>
                      <p className="font-semibold text-slate-800">{(car.kilometers / 1000).toFixed(0)}k km</p>
                    </div>
                    <div className="bg-surface-50 p-1.5 rounded-lg">
                      <p className="text-[10px] text-slate-400 font-medium">Fuel</p>
                      <p className="font-semibold text-slate-800 truncate">{car.fuel}</p>
                    </div>
                  </div>

                  {/* Seller trust mini note */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Seller: <strong>{car.seller.name}</strong></span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Bank Verified
                    </span>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="mt-5 pt-3 border-t border-surface-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      {car.biddingEnabled ? 'Current Bid' : 'Asking Price'}
                    </span>
                    <p className="text-xl font-extrabold text-slate-900">
                      {formatLakhs(car.biddingEnabled ? car.currentBid : car.price)}
                    </p>
                  </div>
                  <Link
                    to={`/cars/${car.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    <span>View Deal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
