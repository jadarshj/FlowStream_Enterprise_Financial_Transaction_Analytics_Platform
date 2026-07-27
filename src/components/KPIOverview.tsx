import React from "react";
import { PipelineMetrics } from "../types";
import { DollarSign, ShieldAlert, AlertTriangle, Clock, CheckCircle2, TrendingUp, Layers } from "lucide-react";

interface KPIOverviewProps {
  metrics: PipelineMetrics;
}

export const KPIOverview: React.FC<KPIOverviewProps> = ({ metrics }) => {
  const formatCurrencyINR = (num: number) => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(1)}M`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)}L`;
    }
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  return (
    <div id="kpi-overview-section" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
      {/* Today's Revenue */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
          <span className="font-medium">Today's Revenue</span>
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900 tracking-tight font-mono">
            {formatCurrencyINR(metrics.todayRevenueINR)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% vs target</span>
          </div>
        </div>
      </div>

      {/* Today's Transactions */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
          <span className="font-medium">Total Ingested Volume</span>
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900 tracking-tight font-mono">
            {formatNumber(metrics.todayVolume)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Avg ~2,450 txns / sec
          </div>
        </div>
      </div>

      {/* Fraud Alerts */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
          <span className="font-medium">Fraud Alerts</span>
          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl font-bold text-rose-600 tracking-tight font-mono flex items-center gap-1.5">
            <span>{metrics.fraudAlertsCount}</span>
            <span className="text-[10px] bg-rose-100 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded font-sans uppercase font-semibold">Flagged</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Deterministic rule active
          </div>
        </div>
      </div>

      {/* Failed / DLQ Count */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
          <span className="font-medium">Failed & DLQ</span>
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl font-bold text-amber-600 tracking-tight font-mono">
            {metrics.failedTransactionsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            DLQ Failure Rate: <span className="text-amber-700 font-semibold">1.5%</span>
          </div>
        </div>
      </div>

      {/* Processing Latency */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
          <span className="font-medium">Processing Latency</span>
          <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900 tracking-tight font-mono">
            {metrics.processingLatencyMs} <span className="text-xs font-normal text-slate-500">ms</span>
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">
            Sub-200ms SLA met
          </div>
        </div>
      </div>

      {/* Pipeline Health */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
          <span className="font-medium">Pipeline Health</span>
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-emerald-600 uppercase tracking-wide flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{metrics.pipelineHealth}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Postgres + Redis Ready
          </div>
        </div>
      </div>
    </div>
  );
};
