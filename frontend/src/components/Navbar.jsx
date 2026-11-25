import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ArrowRightLeft, Gavel } from 'lucide-react';

const focus = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2';

export default function Navbar() {
  const { role, toggleRole, orders } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const activeEscrowOrders = orders.filter((o) => o.status === 'PAID_IN_ESCROW');

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className={`flex items-center gap-2.5 rounded-lg ${focus}`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white">
            M
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-slate-900">
            Marketplace
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Escrow Bidding
          </span>
        </Link>

        {/* Primary Desktop Nav */}
        <nav className="hidden items-center gap-1 text-sm font-medium text-slate-600 md:flex" aria-label="Primary">
          <Link
            to="/"
            className={`rounded-lg px-3.5 py-2 transition-colors hover:bg-slate-100 hover:text-slate-900 ${focus} ${
              location.pathname === '/' ? 'text-slate-900 bg-slate-100/70 font-semibold' : ''
            }`}
          >
            Live Auctions
          </Link>
          <a
            href="/#how-bidding-works"
            className={`rounded-lg px-3.5 py-2 transition-colors hover:bg-slate-100 hover:text-slate-900 ${focus}`}
          >
            How Bidding Works
          </a>
          <Link
            to={role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer'}
            className={`rounded-lg px-3.5 py-2 transition-colors hover:bg-slate-100 hover:text-slate-900 ${focus} flex items-center gap-1.5`}
          >
            <span>{role === 'seller' ? 'Auctioneer Hub' : 'My Bids & Escrow'}</span>
            {activeEscrowOrders.length > 0 && (
              <span className="flex h-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
                {activeEscrowOrders.length}
              </span>
            )}
          </Link>
        </nav>

        {/* Right CTA Area */}
        <div className="flex items-center gap-2.5">
          {/* Quick role toggle */}
          <button
            onClick={toggleRole}
            className={`hidden sm:inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors ${focus} cursor-pointer`}
            title="Toggle between Bidder and Seller view"
          >
            <ArrowRightLeft className="h-3.5 w-3.5 text-slate-500" />
            <span>{role === 'seller' ? 'Seller View' : 'Bidder View'}</span>
          </button>

          <Link
            to="/login"
            className={`hidden rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 sm:block ${focus}`}
          >
            Sign in
          </Link>

          <Link
            to="/sell"
            className={`flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 ${focus}`}
          >
            <Gavel className="h-3.5 w-3.5" />
            <span>List for Bidding</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/70 bg-white px-4 py-4 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs text-slate-500 font-medium">Mode: <strong className="capitalize text-slate-800">{role === 'seller' ? 'Seller (Auctioneer)' : 'Bidder'}</strong></span>
            <button
              onClick={() => {
                toggleRole();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-indigo-600 font-semibold"
            >
              Switch mode
            </button>
          </div>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Live Auctions
          </Link>
          <Link
            to={role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer'}
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            My Bids & Escrow {activeEscrowOrders.length > 0 && `(${activeEscrowOrders.length} active)`}
          </Link>
          <Link
            to="/sell"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-slate-50"
          >
            + List Item for Bidding
          </Link>
        </div>
      )}
    </header>
  );
}
