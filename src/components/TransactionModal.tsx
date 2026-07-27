import React from "react";
import { Transaction } from "../types";
import { X, ShieldAlert, CreditCard, MapPin, User, Building } from "lucide-react";

interface TransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl text-slate-800 text-xs space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-mono font-bold text-xs">
              {transaction.id}
            </span>
            <h3 className="text-sm font-bold text-slate-900">Transaction Metadata Inspector</h3>
          </div>

          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Transaction Summary Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 font-sans">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-500 text-[11px] font-medium">Total Amount</div>
              <div className="text-2xl font-bold text-slate-900 font-mono">
                ₹{transaction.amount.toLocaleString("en-IN")}{" "}
                <span className="text-xs text-slate-500 font-sans">{transaction.currency}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-slate-500 text-[11px] font-medium">Fraud Risk Level</div>
              <span
                className={`inline-block px-2.5 py-1 rounded font-bold font-mono text-xs ${
                  transaction.riskLevel === "HIGH"
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : transaction.riskLevel === "MEDIUM"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {transaction.riskLevel} ({transaction.fraudScore}/100)
              </span>
            </div>
          </div>

          {transaction.fraudReason && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-2.5 rounded-lg text-[11px] flex items-center gap-2 font-medium">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{transaction.fraudReason}</span>
            </div>
          )}
        </div>

        {/* Detailed Attribute Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs font-sans">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="text-slate-500 text-[11px] flex items-center gap-1 font-medium">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Sender Account</span>
            </div>
            <div className="font-semibold text-slate-900">{transaction.sender}</div>
            <div className="text-[10px] text-slate-500 font-mono">{transaction.accountNumber}</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="text-slate-500 text-[11px] flex items-center gap-1 font-medium">
              <Building className="w-3.5 h-3.5 text-indigo-600" />
              <span>Merchant / Beneficiary</span>
            </div>
            <div className="font-semibold text-slate-900">{transaction.merchant}</div>
            <div className="text-[10px] text-slate-500">{transaction.category}</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="text-slate-500 text-[11px] flex items-center gap-1 font-medium">
              <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
              <span>Payment Channel</span>
            </div>
            <div className="font-semibold text-slate-900">{transaction.paymentMethod}</div>
            <div className="text-[10px] text-emerald-600 font-mono font-medium">Status: {transaction.status}</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="text-slate-500 text-[11px] flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>IP & Jurisdiction</span>
            </div>
            <div className="font-semibold text-slate-900">{transaction.location}</div>
            <div className="text-[10px] text-slate-500 font-mono">IP: {transaction.ipAddress}</div>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-mono text-center pt-2 border-t border-slate-100">
          Device ID: {transaction.deviceId} | Timestamp: {new Date(transaction.timestamp).toISOString()}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
