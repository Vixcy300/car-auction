import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="section py-24 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
        <Car className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-md mx-auto">
        The page you are looking for does not exist or has been moved to a new route.
      </p>
      <div>
        <Link to="/" className="btn btn-primary inline-flex gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to RevEscrow Home</span>
        </Link>
      </div>
    </div>
  );
}
