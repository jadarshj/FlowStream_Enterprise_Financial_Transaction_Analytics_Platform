import React, { useState } from "react";
import { Transaction } from "../types";
import { Search, Filter, ShieldAlert, CheckCircle, AlertCircle, Eye, Plus, ShieldCheck, Zap } from "lucide-react";

interface LiveStreamFeedProps {
  transactions: Transaction[];
  onAddTransaction: (txn: Partial<Transaction>) => void;
  onInspectTransaction: (txn: Transaction) => void;
}

export const LiveStreamFeed: React.FC<LiveStreamFeedProps> = ({
  transactions,
  onAddTransaction,
  onInspectTransaction,
}) => {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [showManualForm, setShowManualForm] = useState(false);

  // Form State for Quick Test Ingestion
  const [sender, setSender] = useState("");
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [location, setLocation] = useState("Mumbai, India");

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      (t.id || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.sender || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.merchant || "").toLowerCase().includes(search.toLowerCase());
    const matchesMethod = methodFilter === "ALL" || t.paymentMethod === methodFilter;
    const matchesRisk = riskFilter === "ALL" || t.riskLevel === riskFilter;
    return matchesSearch && matchesMethod && matchesRisk;
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender || !amount) return;

    onAddTransaction({
      sender,
      amount: parseFloat(amount),
      merchant: merchant || "Direct Pay Merchant",
      paymentMethod,
      location,
      currency: "INR",
    });

    setSender("");
    setAmount("");
    setMerchant("");
    setShowManualForm(false);
  };

  const getRiskBadge = (risk: string, score: number) => {
    if (risk === "HIGH") {
      return (
        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold px-2 py-0.5 rounded">
          <ShieldAlert className="w-3 h-3 text-rose-600" />
          HIGH ({score})
        </span>
      );
    }
    if (risk === "MEDIUM") {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded">
          <AlertCircle className="w-3 h-3 text-amber-600" />
          MED ({score})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded">
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
        LOW ({score})
      </span>
    );
  };

  return (
    <div id="livestream-feed-panel" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Real-Time Streaming Transaction Ingestion Feed</span>
            <span className="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-mono font-medium">
              Kafka Topic: finstream.txns.v1
            </span>
          </h2>
        </div>

        <button
          onClick={() => setShowManualForm(!showManualForm)}
          id="btn-toggle-manual-test-txn"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Inject Custom Transaction</span>
        </button>
      </div>

      {/* Manual Ingestion Test Bench */}
      {showManualForm && (
        <form
          onSubmit={handleManualSubmit}
          id="form-manual-ingest-test"
          className="mb-4 bg-slate-50 border border-indigo-200 rounded-xl p-4 text-xs text-slate-800 space-y-3"
        >
          <div className="font-semibold text-indigo-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-600" />
              Test Ingestion Rule Engine
            </span>
            <span className="text-[11px] text-slate-500 font-normal">Triggers validation & fraud scoring in real-time</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-slate-600 font-medium text-[11px] mb-1">Sender Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ritesh Agarwal"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium text-[11px] mb-1">Amount (INR) *</label>
              <input
                type="number"
                required
                placeholder="e.g. 250000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium text-[11px] mb-1">Merchant</label>
              <input
                type="text"
                placeholder="e.g. Crypto Global Exchange"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium text-[11px] mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 text-xs"
              >
                <option value="UPI">UPI</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="NEFT">NEFT</option>
                <option value="RTGS">RTGS</option>
                <option value="SWIFT">SWIFT</option>
                <option value="Internet Banking">Internet Banking</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium text-[11px] mb-1">IP Jurisdiction</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 text-xs"
              >
                <option value="Mumbai, India">Mumbai, India (Domestic)</option>
                <option value="Delhi, India">Delhi, India (Domestic)</option>
                <option value="Lagos, Nigeria">Lagos, Nigeria (High Risk IP)</option>
                <option value="London, UK">London, UK (International)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowManualForm(false)}
              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-xs transition shadow-xs"
            >
              Publish to Kafka Topic
            </button>
          </div>
        </form>
      )}

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Txn ID, Sender, Merchant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="input-search-txns"
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Method Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            id="select-filter-payment-method"
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Payment Channels</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="RTGS">RTGS</option>
            <option value="NEFT">NEFT</option>
            <option value="SWIFT">SWIFT</option>
            <option value="Internet Banking">Internet Banking</option>
          </select>
        </div>

        {/* Risk Filter */}
        <div>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            id="select-filter-risk-level"
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk Only (&gt; 75)</option>
            <option value="MEDIUM">Medium Risk Only (40 - 75)</option>
            <option value="LOW">Low Risk Only (&lt; 40)</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Txn ID & Time</th>
              <th className="py-2.5 px-3">Sender & Account</th>
              <th className="py-2.5 px-3">Amount</th>
              <th className="py-2.5 px-3">Channel</th>
              <th className="py-2.5 px-3">Merchant / Receiver</th>
              <th className="py-2.5 px-3">Jurisdiction IP</th>
              <th className="py-2.5 px-3">Risk Level</th>
              <th className="py-2.5 px-3 text-right">Inspect</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-sans">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  No transactions match the current filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((t, idx) => (
                <tr
                  key={t.id + idx}
                  className={`hover:bg-slate-50 transition cursor-pointer ${
                    idx === 0 ? "bg-indigo-50/40" : ""
                  }`}
                  onClick={() => onInspectTransaction(t)}
                >
                  <td className="py-2.5 px-3 font-mono">
                    <div className="font-bold text-indigo-900">{t.id}</div>
                    <div className="text-[10px] text-slate-500 font-sans">
                      {new Date(t.timestamp).toLocaleTimeString()}
                    </div>
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900">{t.sender}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{t.accountNumber}</div>
                  </td>

                  <td className="py-2.5 px-3 font-bold text-slate-900 font-mono">
                    ₹{t.amount.toLocaleString("en-IN")}
                  </td>

                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium">
                      {t.paymentMethod}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 font-medium text-slate-800">
                    {t.merchant}
                  </td>

                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                    {t.location}
                  </td>

                  <td className="py-2.5 px-3">
                    {getRiskBadge(t.riskLevel, t.fraudScore)}
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectTransaction(t);
                      }}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-indigo-600 transition"
                      title="View Transaction Metadata"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
