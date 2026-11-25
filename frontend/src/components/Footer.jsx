import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:px-8">
        <p className="max-w-xl">
          Marketplace acts as an intermediary under Section 79 of the IT Act and does not own the goods listed.
        </p>
        <ul className="flex flex-wrap gap-6">
          {["Terms", "Privacy", "Commission policy", "Refund policy", "Contact"].map((l) => (
            <li key={l}>
              <a href="#" className="transition-colors hover:text-slate-900">
                {l}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
