import React, { useState } from "react";
import { FraudAlert, UserRole } from "../types";
import { ShieldAlert, Sparkles, Check, X, ShieldCheck, Terminal, AlertTriangle, Lock } from "lucide-react";

interface FraudDetectionPanelProps {
  alerts: FraudAlert[];
  currentRole: UserRole;
  onResolveAlert: (id: string, action: "BLOCKED" | "APPROVED", notes?: string) => void;
  onExplainFraudAI: (alertId: string) => Promise<string>;
}

export const FraudDetectionPanel: React.FC<FraudDetectionPanelProps> = ({
  alerts,
  currentRole,
  onResolveAlert,
  onExplainFraudAI,
}) => {
  const [selectedAlertForAi, setSelectedAlertForAi] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const canBlockApprove = currentRole === "Admin" || currentRole === "Analyst";
  const canAiForensic = currentRole !== "Read-only User";

  const handleAiForensicCall = async (alertId: string) => {
    if (!canAiForensic) {
      setPermissionError(`🔒 Access Denied: Role '${currentRole}' is not authorized to generate AI Forensic Reports.`);
      return;
    }
    setPermissionError(null);
    setSelectedAlertForAi(alertId);
    setLoadingAi(true);
    try {
      const exp = await onExplainFraudAI(alertId);
      setAiExplanation(exp);
    } catch (err) {
      setAiExplanation("Unable to generate AI forensic report. Check network connection.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleResolveClick = (id: string, action: "BLOCKED" | "APPROVED") => {
    if (!canBlockApprove) {
      setPermissionError(`🔒 Access Denied: Role '${currentRole}' is not authorized to ${action.toLowerCase()} fraud alerts. (Required Role: Admin or Analyst)`);
      return;
    }
    setPermissionError(null);
    onResolveAlert(id, action, `Resolved by ${currentRole}`);
  };

  return (
    <div id="fraud-detection-panel" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>Deterministic Fraud Engine & AI Forensics</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sub-200ms velocity anomaly scoring paired with server-side Gemini 3.6 AI root-cause analysis.
          </p>
        </div>

        <span className="text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-md">
          {alerts.filter((a) => a.status === "OPEN" || a.status === "INVESTIGATING" || a.status === "PENDING").length} Open Alerts
        </span>
      </div>

      {/* Permission Error Banner */}
      {permissionError && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{permissionError}</span>
          </div>
          <button
            onClick={() => setPermissionError(null)}
            className="text-rose-600 hover:text-rose-900 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* AI Explanation Result Modal/Box */}
      {selectedAlertForAi && (
        <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-4 text-xs space-y-2 relative">
          <div className="flex items-center justify-between font-bold text-indigo-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Gemini AI Forensic Investigation Summary ({selectedAlertForAi})</span>
            </div>
            <button
              onClick={() => setSelectedAlertForAi(null)}
              className="text-slate-500 hover:text-slate-800 text-xs font-semibold"
            >
              Close
            </button>
          </div>

          {loadingAi ? (
            <div className="py-4 text-center text-indigo-700 font-medium animate-pulse">
              Generating Gemini AI Forensic Report for transaction velocity anomaly...
            </div>
          ) : (
            <div className="text-slate-800 leading-relaxed font-sans pt-1 whitespace-pre-line bg-white p-3 rounded-lg border border-indigo-100 text-[11px]">
              {aiExplanation}
            </div>
          )}
        </div>
      )}

      {/* Alerts Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Alert ID & Txn</th>
              <th className="py-2.5 px-3">Triggered Fraud Rule</th>
              <th className="py-2.5 px-3">Amount</th>
              <th className="py-2.5 px-3">Score</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-sans">
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-500">
                  No fraud alerts recorded. System is operating safely.
                </td>
              </tr>
            ) : (
              alerts.map((alert) => {
                const ruleText = alert.triggeredRules && alert.triggeredRules.length > 0
                  ? alert.triggeredRules.join(", ")
                  : (alert as any).ruleTriggered || "Velocity Anomaly";
                const customer = alert.customerName || (alert as any).sender || "Unknown Customer";
                const scoreVal = alert.fraudScore ?? (alert as any).score ?? 0;
                const isUnresolved = alert.status === "OPEN" || alert.status === "INVESTIGATING" || alert.status === "PENDING";

                return (
                  <tr key={alert.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      <div>{alert.id}</div>
                      <div className="text-[10px] text-indigo-600 font-semibold">{alert.transactionId}</div>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{ruleText}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{customer} → {alert.merchant}</div>
                    </td>

                    <td className="py-2.5 px-3 font-bold text-slate-900 font-mono">
                      ₹{alert.amount.toLocaleString("en-IN")}
                    </td>

                    <td className="py-2.5 px-3 font-mono">
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">
                        {scoreVal}/100
                      </span>
                    </td>

                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isUnresolved
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : alert.status === "BLOCKED"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {alert.status}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleAiForensicCall(alert.id)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded font-semibold text-[11px] transition ${
                          canAiForensic
                            ? "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200"
                            : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                        }`}
                        title={canAiForensic ? "Run Gemini AI Forensic Investigation" : `Restricted for role ${currentRole}`}
                      >
                        {!canAiForensic && <Lock className="w-3 h-3 text-slate-400" />}
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        <span>AI Report</span>
                      </button>

                      {isUnresolved && (
                        <>
                          <button
                            onClick={() => handleResolveClick(alert.id, "BLOCKED")}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded font-semibold text-[11px] transition ${
                              canBlockApprove
                                ? "bg-rose-600 hover:bg-rose-700 text-white"
                                : "bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed"
                            }`}
                            title={canBlockApprove ? "Block Transaction & Freeze Account" : `Action restricted for role '${currentRole}' (Requires Admin or Analyst)`}
                          >
                            {!canBlockApprove && <Lock className="w-3 h-3 text-slate-500" />}
                            <span>Block</span>
                          </button>
                          <button
                            onClick={() => handleResolveClick(alert.id, "APPROVED")}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded font-semibold text-[11px] transition ${
                              canBlockApprove
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed"
                            }`}
                            title={canBlockApprove ? "Approve & Release to Warehouse" : `Action restricted for role '${currentRole}' (Requires Admin or Analyst)`}
                          >
                            {!canBlockApprove && <Lock className="w-3 h-3 text-slate-500" />}
                            <span>Approve</span>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
