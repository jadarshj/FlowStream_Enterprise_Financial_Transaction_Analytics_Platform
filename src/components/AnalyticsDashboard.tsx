import React, { useState } from "react";
import { HourlyRevenue, ChannelDistribution, TopMerchant, CountrySpend } from "../types";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart3, PieChart as PieIcon, Globe, Store, Sparkles, Terminal, ArrowRight, HelpCircle } from "lucide-react";

interface AnalyticsDashboardProps {
  hourlyRevenue: HourlyRevenue[];
  channelDistribution: ChannelDistribution[];
  topMerchants: TopMerchant[];
  countrySpend: CountrySpend[];
  onRunAiSql: (prompt: string) => Promise<{ sql: string; insights: string }>;
}

const COLORS = ["#2563eb", "#4f46e5", "#059669", "#d97706", "#e11d48", "#7c3aed"];

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  hourlyRevenue,
  channelDistribution,
  topMerchants,
  countrySpend,
  onRunAiSql,
}) => {
  const [nlQuery, setNlQuery] = useState("");
  const [aiSqlResult, setAiSqlResult] = useState<{ sql: string; insights: string } | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  const handleAiQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlQuery.trim()) return;

    setIsQuerying(true);
    try {
      const res = await onRunAiSql(nlQuery);
      setAiSqlResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleQuickChip = (prompt: string) => {
    setNlQuery(prompt);
  };

  return (
    <div id="analytics-warehouse-dashboard" className="space-y-6">
      {/* Top Natural Language SQL Query Engine (Metabase / Superset Style) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1 rounded bg-indigo-50 text-indigo-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Natural Language AI-to-SQL Query Engine (Metabase & Superset Pattern)
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Ask questions in plain English to auto-generate PostgreSQL warehouse queries and instant executive insights.
        </p>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px]">
          <span className="text-slate-500 font-semibold">Try asking:</span>
          {[
            "Top 5 merchants with highest fraud ratio",
            "Peak UPI volume hour in last 24h",
            "Country breakdown of RTGS transfers"
          ].map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleQuickChip(prompt)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-md border border-slate-200 font-medium transition"
            >
              "{prompt}"
            </button>
          ))}
        </div>

        <form onSubmit={handleAiQuerySubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. What is the peak transaction hour for UPI payments?"
            value={nlQuery}
            onChange={(e) => setNlQuery(e.target.value)}
            id="input-nl-sql-query"
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
          />
          <button
            type="submit"
            disabled={isQuerying}
            id="btn-run-ai-sql"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
          >
            <span>{isQuerying ? "Generating SQL..." : "Execute Query"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {aiSqlResult && (
          <div className="mt-4 bg-slate-900 text-slate-100 rounded-lg p-3 text-xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-mono font-semibold">
              <Terminal className="w-4 h-4" />
              <span>Generated PostgreSQL Query:</span>
            </div>
            <pre className="bg-slate-950 p-2.5 rounded text-emerald-400 font-mono overflow-x-auto text-[11px]">
              {aiSqlResult.sql}
            </pre>
            <div className="text-slate-300 font-sans pt-1">
              <span className="font-semibold text-sky-400">Warehouse Insight: </span>
              {aiSqlResult.insights}
            </div>
          </div>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Revenue Trend */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Hourly Ingestion Volume & Revenue Trend</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Last 24 Hours</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyRevenue}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickFormatter={(val) => `₹${(val / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", color: "#0f172a", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  formatter={(val: number) => [`₹${(val / 1000000).toFixed(2)}M`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Channel Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-600" />
              <span>Payment Channel Share (UPI, Card, RTGS)</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Channel Share</span>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="percentage"
                  nameKey="channel"
                  label={({ channel, percentage }) => `${channel} (${percentage}%)`}
                >
                  {channelDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", color: "#0f172a", borderRadius: "8px" }}
                  formatter={(val: number) => [`${val}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Top Merchants & Country Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Merchants */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>Top Ingestion Merchants & Fraud Ratios</span>
          </h3>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Merchant Name</th>
                  <th className="py-2.5 px-3">Total Volume</th>
                  <th className="py-2.5 px-3">Txn Count</th>
                  <th className="py-2.5 px-3">Fraud Ratio %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {topMerchants.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {m.name}
                    </td>
                    <td className="py-2.5 px-3 font-bold font-mono text-slate-900">
                      {m.totalVolume}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {m.count.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          parseFloat(m.fraudRatio) > 1.0
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {m.fraudRatio}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>Country-Wise Transaction Spend</span>
          </h3>

          <div className="space-y-3 font-sans text-xs pt-1">
            {countrySpend.map((c, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-slate-700 text-xs">
                  <span className="font-medium">{c.country}</span>
                  <span className="font-mono font-bold text-indigo-600">{c.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${c.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
