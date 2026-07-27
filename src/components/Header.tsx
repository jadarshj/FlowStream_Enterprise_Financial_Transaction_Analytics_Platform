import React from "react";
import { UserRole } from "../types";
import { Activity, Shield, Database, Cpu, Search, FileText, Upload, Sparkles, Play, Pause, Zap, GitCommit, Layers } from "lucide-react";

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  streamSpeed: number;
  onChangeSpeed: (speed: number) => void;
  onSimulateSpike: () => void;
  onOpenCsvModal: () => void;
  onOpenDiscussion: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  isStreaming,
  onToggleStreaming,
  streamSpeed,
  onChangeSpeed,
  onSimulateSpike,
  onOpenCsvModal,
  onOpenDiscussion,
  activeTab,
  onSelectTab,
}) => {
  return (
    <header id="finstream-header" className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Notice / Status Bar */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Kafka Cluster: 3 Nodes Active
          </span>
          <span className="hidden sm:inline-block text-slate-600">|</span>
          <span className="text-slate-300 font-mono text-[11px]">Spark Streaming: 2,450 TPS</span>
          <span className="hidden md:inline-block text-slate-600">|</span>
          <span className="hidden md:inline-block text-slate-300 font-mono text-[11px]">End-to-End Latency: <span className="text-emerald-400 font-bold">118ms</span></span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDiscussion}
            id="btn-discussion-prds"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-[11px] transition shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Architecture Blueprint</span>
          </button>

          <button
            onClick={onOpenCsvModal}
            id="btn-open-csv-ingest"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded font-medium text-[11px] transition"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Batch CSV Upload</span>
          </button>
        </div>
      </div>

      {/* Main Branding & Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Platform Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Activity className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 font-sans">
                FinStream
              </h1>
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
                Enterprise v3.4
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block font-normal">
              High-Throughput Payment Data & Fraud Analysis Platform
            </p>
          </div>
        </div>

        {/* Live Controls Bar */}
        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs">
          <div className="flex items-center gap-1.5 px-1.5 text-slate-700 font-medium">
            <span className="text-slate-500 text-[11px]">Stream Generator:</span>
            <button
              onClick={onToggleStreaming}
              id="btn-toggle-stream"
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold text-[11px] transition ${
                isStreaming
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-amber-600 text-white hover:bg-amber-700"
              }`}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Active</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Paused</span>
                </>
              )}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 border-l border-slate-200 pl-2">
            <span className="text-slate-500 text-[11px]">Speed:</span>
            {[1, 2, 5].map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                  streamSpeed === s
                    ? "bg-indigo-600 text-white font-bold"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            onClick={onSimulateSpike}
            id="btn-simulate-fraud-spike"
            title="Inject fraudulent high-velocity transactions"
            className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded transition text-[11px] font-semibold"
          >
            <Zap className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden md:inline">Inject Fraud Attack</span>
          </button>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden lg:inline">Role:</span>
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            id="select-rbac-role"
            className="bg-white border border-slate-300 text-slate-800 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs font-medium"
          >
            <option value="Admin">Admin (Full Access)</option>
            <option value="Data Engineer">Data Engineer (Kafka/DLQ)</option>
            <option value="Analyst">Financial Analyst (KPIs)</option>
            <option value="Auditor">Auditor (Compliance)</option>
            <option value="Read-only User">Read-only User</option>
          </select>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center space-x-1 overflow-x-auto text-xs font-medium border-t border-slate-100 no-scrollbar">
        {[
          { id: "overview", label: "Executive Overview", icon: Activity },
          { id: "comparison", label: "Lineage & Frameworks", icon: GitCommit },
          { id: "livestream", label: "Live Stream Ingestion", icon: Zap },
          { id: "validation", label: "Data Quality & DLQ", icon: Database },
          { id: "fraud", label: "Fraud Detection Engine", icon: Shield },
          { id: "analytics", label: "Warehouse Analytics", icon: FileText },
          { id: "pipeline", label: "Pipeline DevOps", icon: Cpu },
          { id: "audit", label: "Audit Logs & RBAC", icon: Search },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              id={`tab-nav-${tab.id}`}
              className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 transition whitespace-nowrap font-medium ${
                isActive
                  ? "border-indigo-600 text-indigo-600 bg-indigo-50/50 font-semibold"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-500"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
