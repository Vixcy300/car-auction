import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { initialListings } from "../data/cars";

const CATEGORIES = ["All", "Cars", "Bikes", "Electronics", "Home"];
const AUCTION_FILTERS = ["All auctions", "Ending soon", "High activity", "Newest bids"];
const PRICES = [
  { label: "Any bid range", max: Infinity },
  { label: "Under ₹1,00,000", max: 100000 },
  { label: "Under ₹5,00,000", max: 500000 },
  { label: "Under ₹15,00,000", max: 1500000 },
];
const SORTS = [
  { value: "bids", label: "Most active bids" },
  { value: "relevance", label: "Recommended" },
  { value: "low", label: "Current bid: low to high" },
  { value: "high", label: "Current bid: high to low" },
];
const STEP = 6;

const inr = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

/* ---------- Icons (inline SVG) ---------- */
const P = {
  search: "M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z",
  shield: "M12 3l8 3v6c0 4.5-3.2 8.3-8 9-4.8-.7-8-4.5-8-9V6l8-3zM9 12l2 2 4-4",
  pin: "M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  heart: "M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z",
  image: "M4 5h16v14H4V5zM4 16l4.5-4.5 3.5 3.5 3-3L20 16M9 9.5h.01",
  check: "M5 12l4 4 10-10",
  lock: "M7 11V8a5 5 0 0110 0v3M6 11h12v9H6v-9z",
  doc: "M7 3h7l4 4v14H7V3zM14 3v4h4M10 13h5M10 17h5",
  gavel: "M14 7l3 3m-9 9l7-7m-4-8L8 7l7 7 3-3a2.8 2.8 0 000-4l-4-4a2.8 2.8 0 00-4 0zM3 21l6-6",
  clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
};

const Icon = ({ d, className = "h-5 w-5", fill = "none" }) => (
  <svg
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2";

/* ---------- Sections ---------- */
function Hero({ query, setQuery, category, setCategory }) {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 mb-4">
          <Icon d={P.gavel} className="h-3.5 w-3.5" />
          <span>100% P2P Bidding & Live Auctions</span>
        </div>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl sm:leading-[1.1]">
          Place live bids directly, with winning funds held in escrow.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
          Transparent peer-to-peer bidding with verified sellers. Your winning bid is locked safely in RBI-regulated nodal escrow until you inspect and approve delivery.
        </p>

        <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-8 max-w-2xl">
          <label htmlFor="q" className="sr-only">
            Search live auctions
          </label>
          <div className="flex items-center gap-3 rounded-full bg-white p-2 pl-5 shadow-[0_8px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-indigo-600">
            <Icon d={P.search} className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              id="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search live auctions by item, brand or city..."
              className="w-full bg-transparent py-2 text-[15px] text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className={`rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 ${focus}`}
            >
              Search
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Categories">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${focus} ${
                category === c
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Toolbar({ filter, setFilter, price, setPrice, verified, setVerified, sort, setSort, count }) {
  const select = `rounded-full border-0 bg-white py-2 pl-4 pr-9 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300 ${focus}`;
  return (
    <div className="sticky top-16 z-20 border-y border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Auction status filter pills */}
        <div className="inline-flex rounded-full bg-slate-100 p-1" role="group" aria-label="Auction filter">
          {AUCTION_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${focus} ${
                filter === f
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <label className="sr-only" htmlFor="price">
          Current Bid Range
        </label>
        <select
          id="price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className={select}
        >
          {PRICES.map((p, i) => (
            <option key={p.label} value={i}>
              {p.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          role="switch"
          aria-checked={verified}
          onClick={() => setVerified(!verified)}
          className={`flex items-center gap-2.5 rounded-full py-1 pr-3 text-sm font-medium text-slate-700 ${focus} cursor-pointer`}
        >
          <span
            className={`relative h-6 w-10 rounded-full transition-colors ${
              verified ? "bg-indigo-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                verified ? "left-[18px]" : "left-0.5"
              }`}
            />
          </span>
          Verified sellers
        </button>

        <div className="ml-auto flex items-center gap-4">
          <p className="hidden text-sm text-slate-500 sm:block" aria-live="polite">
            {count} active {count === 1 ? "auction" : "auctions"}
          </p>
          <label className="sr-only" htmlFor="sort">
            Sort live auctions
          </label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className={select}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ item, saved, toggleSave }) {
  const currentBid = item.currentBid || item.price;
  const bidsCount = item.bids || 1;

  return (
    <article className="group relative">
      <Link to={`/cars/${item.id}`} className={`block rounded-2xl ${focus}`}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300 transition-transform duration-500 group-hover:scale-105">
              <Icon d={P.image} className="h-14 w-14" />
            </div>
          )}
          
          {/* Top-left condition tag */}
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-slate-800 shadow-sm">
            {item.condition || "Used"}
          </span>

          {/* Bottom-left live auction status badge */}
          <span className="absolute bottom-3 left-3 rounded-full bg-slate-900/90 px-3 py-1 text-xs font-medium text-white backdrop-blur flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />
            <span>Auction &bull; {bidsCount} bids</span>
          </span>

          {/* Bottom-right remaining time */}
          {item.bidEndsAt && (
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-medium text-slate-200 backdrop-blur flex items-center gap-1">
              <Icon d={P.clock} className="h-3 w-3" />
              <span>{item.bidEndsAt}</span>
            </span>
          )}
        </div>

        <div className="px-1 pt-4">
          <p className="flex items-center gap-1 text-[13px] text-slate-500">
            <Icon d={P.pin} className="h-3.5 w-3.5" /> {item.city}
            <span className="mx-1 text-slate-300">|</span> {item.category || "Cars"}
          </p>
          <h3 className="mt-1.5 line-clamp-1 text-[15px] font-medium text-slate-900 group-hover:text-indigo-700">
            {item.title}
          </h3>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Current winning bid</p>
              <p className="text-lg font-bold tracking-tight text-slate-900">{inr(currentBid)}</p>
            </div>
            <span
              className={`flex items-center gap-1 text-xs font-medium ${
                item.verified ? "text-emerald-700" : "text-slate-400"
              }`}
            >
              <Icon d={item.verified ? P.check : P.shield} className="h-3.5 w-3.5" />
              {item.verified ? "Verified seller" : "Unverified"}
            </span>
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleSave(item.id)}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${item.title} from saved` : `Save ${item.title}`}
        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition-colors hover:bg-white ${focus} ${
          saved ? "text-rose-600" : "text-slate-600"
        } cursor-pointer`}
      >
        <Icon d={P.heart} className="h-[18px] w-[18px]" fill={saved ? "currentColor" : "none"} />
      </button>
    </article>
  );
}

function Assurance() {
  const items = [
    {
      icon: P.lock,
      title: "Escrow-held winning bids",
      text: "When an auction ends, your winning bid is deposited in RBI nodal escrow until you test and confirm delivery.",
    },
    {
      icon: P.gavel,
      title: "Transparent P2P bidding",
      text: "Every bid is recorded in real time. If outbid, you are never locked in or charged arbitrarily.",
    },
    {
      icon: P.check,
      title: "Penny-drop verified sellers",
      text: "Bank account and identity checks are authenticated before any auction goes live on the marketplace.",
    },
  ];

  return (
    <section id="how-bidding-works" className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        {items.map((i) => (
          <div key={i.title} className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 ring-1 ring-slate-200">
              <Icon d={i.icon} className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900">{i.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{i.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Main Marketplace Component ---------- */
export default function Home() {
  const { cars } = useAuth();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [filter, setFilter] = useState("All auctions");
  const [price, setPrice] = useState(0);
  const [verified, setVerified] = useState(false);
  const [sort, setSort] = useState("bids");
  const [shown, setShown] = useState(STEP);
  const [saved, setSaved] = useState(() => new Set());

  // Merge the user's initial listings with any auctions added through the app
  const allItems = useMemo(() => {
    const combined = [...initialListings];
    if (cars && cars.length > 0) {
      cars.forEach((car) => {
        if (!combined.some((item) => item.id === car.id)) {
          combined.unshift({
            id: car.id,
            title: car.title,
            category: "Cars",
            city: car.city || "Mumbai",
            price: car.currentBid || car.price,
            currentBid: car.currentBid || car.price,
            startingBid: car.price,
            mode: "Auction",
            biddingEnabled: true,
            bids: car.bids || 6,
            condition: "Used",
            verified: car.seller?.bankVerified ?? true,
            image: car.images?.[0] || car.image,
            bidEndsAt: "3 days left",
          });
        }
      });
    }
    return combined;
  }, [cars]);

  const wrap = (fn) => (v) => {
    fn(v);
    setShown(STEP);
  };

  const toggleSave = (id) =>
    setSaved((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const reset = () => {
    setQuery("");
    setCategory("All");
    setFilter("All auctions");
    setPrice(0);
    setVerified(false);
    setSort("bids");
    setShown(STEP);
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const max = PRICES[price].max;
    let list = allItems.filter(
      (i) =>
        (category === "All" || i.category === category) &&
        (i.currentBid || i.price) <= max &&
        (!verified || i.verified) &&
        (!q || i.title.toLowerCase().includes(q) || i.city.toLowerCase().includes(q))
    );

    if (filter === "Ending soon") {
      list = list.filter((i) => i.bidEndsAt?.includes("hour") || i.bidEndsAt?.includes("1 day"));
    } else if (filter === "High activity") {
      list = list.filter((i) => (i.bids || 0) >= 10);
    }

    if (sort === "low") list = [...list].sort((a, b) => (a.currentBid || a.price) - (b.currentBid || b.price));
    if (sort === "high") list = [...list].sort((a, b) => (b.currentBid || b.price) - (a.currentBid || a.price));
    if (sort === "bids") list = [...list].sort((a, b) => (b.bids || 0) - (a.bids || 0));
    return list;
  }, [allItems, query, category, filter, price, verified, sort]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <Hero
        query={query}
        setQuery={wrap(setQuery)}
        category={category}
        setCategory={wrap(setCategory)}
      />

      <Toolbar
        filter={filter}
        setFilter={wrap(setFilter)}
        price={price}
        setPrice={wrap(setPrice)}
        verified={verified}
        setVerified={wrap(setVerified)}
        sort={sort}
        setSort={setSort}
        count={results.length}
      />

      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {results.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 py-24 text-center">
            <p className="text-base font-semibold text-slate-900">No active auctions match your filters</p>
            <p className="mt-1 text-sm text-slate-600">Try adjusting your bid range or clear search filters.</p>
            <button
              type="button"
              onClick={reset}
              className={`mt-6 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 ${focus}`}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {results.slice(0, shown).map((item) => (
                <li key={item.id}>
                  <ProductCard item={item} saved={saved.has(item.id)} toggleSave={toggleSave} />
                </li>
              ))}
            </ul>
            {shown < results.length && (
              <div className="mt-14 text-center">
                <button
                  type="button"
                  onClick={() => setShown(shown + STEP)}
                  className={`rounded-full px-7 py-3 text-sm font-medium text-slate-900 ring-1 ring-slate-300 transition-colors hover:bg-slate-50 ${focus} cursor-pointer`}
                >
                  Show more live auctions
                </button>
                <p className="mt-3 text-xs text-slate-500">
                  Showing {Math.min(shown, results.length)} of {results.length} active auctions
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <Assurance />
    </div>
  );
}
