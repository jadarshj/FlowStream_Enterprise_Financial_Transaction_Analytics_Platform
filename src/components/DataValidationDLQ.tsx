import React, { useState } from "react";
import { DLQRecord, DataQualityStats, UserRole } from "../types";
import { AlertOctagon, RotateCcw, CheckCircle, ShieldAlert, FileText, Database, ArrowRight, ShieldCheck, Lock } from "lucide-react";

interface DataValidationDLQProps {
  dlqRecords: DLQRecord[];
  dataQualityStats: DataQualityStats;
  currentRole: UserRole;
  onRedriveRecord: (id: string) => void;
}

export const DataValidationDLQ: React.FC<DataValidationDLQProps> = ({
  dlqRecords,
  dataQualityStats,
  currentRole,
  onRedriveRecord,
}) => {
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const canRedrive = currentRole === "Admin" || currentRole === "Data Engineer";

  const handleRedriveClick = (id: string) => {
    if (!canRedrive) {
      setPermissionError(`🔒 Access Denied: Role '${currentRole}' is not authorized to re-drive DLQ records. (Required Role: Admin or Data Engineer)`);
      return;
    }
    setPermissionError(null);
    onRedriveRecord(id);
  };
  return (
    <div id="data-validation-dlq-panel" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            <span>Data Quality Validation & Dead Letter Queue (DLQ)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            OpenMetadata & DataHub assertion standard: intercepts malformed records and allows manual re-drive into Kafka ingestion.
          </p>
        </div>

        <span className="text-xs font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md">
          DLQ Backlog: {dlqRecords.length} Items
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

      {/* Assertion Pass Rate Progress Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Gateway Data Quality Assertion Pass Rate
          </span>
          <span className="font-mono font-bold text-emerald-700">{dataQualityStats.acceptedPct}% Passed</span>
        </div>

        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full"
            style={{ width: `${dataQualityStats.acceptedPct}%` }}
            title={`Accepted: ${dataQualityStats.acceptedPct}%`}
          />
          <div
            className="bg-amber-400 h-full"
            style={{ width: `${dataQualityStats.duplicatePct}%` }}
            title={`Duplicates: ${dataQualityStats.duplicatePct}%`}
          />
          <div
            className="bg-rose-400 h-full"
            style={{ width: `${dataQualityStats.missingFieldsPct + dataQualityStats.invalidPct}%` }}
            title={`Schema Failures: ${(dataQualityStats.missingFieldsPct + dataQualityStats.invalidPct).toFixed(1)}%`}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 pt-1 font-mono">
          <span className="text-emerald-700 font-medium">Valid Schema: {dataQualityStats.acceptedPct}%</span>
          <span className="text-amber-700 font-medium">Duplicates: {dataQualityStats.duplicatePct}%</span>
          <span className="text-rose-700 font-medium">Corrupt / Negative Amounts: {(dataQualityStats.missingFieldsPct + dataQualityStats.invalidPct).toFixed(1)}%</span>
        </div>
      </div>

      {/* DLQ Quarantined Table */}
      <div>
        <h3 className="text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
          Quarantined Dead Letter Queue (DLQ) Records
        </h3>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">DLQ ID</th>
                <th className="py-2.5 px-3">Failure Reason</th>
                <th className="py-2.5 px-3">Payload Details</th>
                <th className="py-2.5 px-3">Quarantine Time</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-sans">
              {dlqRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    No records in Dead Letter Queue. All ingestion streams are healthy.
                  </td>
                </tr>
              ) : (
                dlqRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-800">
                      {r.id}
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold px-2 py-0.5 rounded">
                        <AlertOctagon className="w-3 h-3 text-rose-600" />
                        {r.failureReason}
                      </span>
                    </td>

    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-800">
      {(() => {
        const payload = r.rawPayload || (r as any).payload || {};
        const sender = payload.sender || payload.customerName || payload.customer || "Unknown Sender";
        const amount = payload.amount !== undefined ? payload.amount : 0;
        const merchant = payload.merchant || "No Merchant";
        const paymentMethod = payload.paymentMethod || "UPI";
        return (
          <>
            <div>{sender} - ₹{amount}</div>
            <div className="text-[10px] text-slate-500 font-sans">{merchant} ({paymentMethod})</div>
          </>
        );
      })()}
    </td>

                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                      {new Date(r.timestamp).toLocaleTimeString()}
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleRedriveClick(r.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-semibold text-xs transition ${
                          canRedrive
                            ? "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200"
                            : "bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed"
                        }`}
                        title={canRedrive ? "Fix payload and re-publish to Kafka topic" : `Action restricted for role '${currentRole}' (Requires Admin or Data Engineer)`}
                      >
                        {!canRedrive ? <Lock className="w-3.5 h-3.5 text-slate-500" /> : <RotateCcw className="w-3.5 h-3.5" />}
                        <span>Re-drive</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
