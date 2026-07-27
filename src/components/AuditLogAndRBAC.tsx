import React, { useState } from "react";
import { AuditLog, UserRole } from "../types";
import { Search, Shield, User, Clock, Terminal, Key } from "lucide-react";

interface AuditLogAndRBACProps {
  auditLogs: AuditLog[];
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const AuditLogAndRBAC: React.FC<AuditLogAndRBACProps> = ({
  auditLogs,
  currentRole,
  onRoleChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canViewAudit = currentRole === "Admin" || currentRole === "Data Engineer" || currentRole === "Auditor";

  return (
    <div id="audit-rbac-panel" className="space-y-6">
      {/* RBAC Governance Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-600" />
              <span>Role-Based Access Control (RBAC) Governance Matrix</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enforces enterprise security partitions across regulatory compliance roles. Active Role: <span className="text-indigo-600 font-bold">{currentRole}</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">Switch Active Role:</span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-1.5 font-medium"
            >
              <option value="Admin">Admin (Full Control)</option>
              <option value="Data Engineer">Data Engineer (Kafka/DLQ)</option>
              <option value="Analyst">Financial Analyst (KPIs)</option>
              <option value="Auditor">Auditor (Compliance)</option>
              <option value="Read-only User">Read-only User</option>
            </select>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Live Stream View</th>
                <th className="py-2.5 px-3">DLQ Re-drive Action</th>
                <th className="py-2.5 px-3">Block / Approve Fraud</th>
                <th className="py-2.5 px-3">AI Forensic Call</th>
                <th className="py-2.5 px-3">Audit Log View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
              {[
                { role: "Admin", live: true, redrive: true, block: true, ai: true, audit: true },
                { role: "Data Engineer", live: true, redrive: true, block: false, ai: true, audit: true },
                { role: "Analyst", live: true, redrive: false, block: true, ai: true, audit: false },
                { role: "Auditor", live: true, redrive: false, block: false, ai: true, audit: true },
                { role: "Read-only User", live: true, redrive: false, block: false, ai: false, audit: false },
              ].map((r, i) => (
                <tr key={i} className={`hover:bg-slate-50 ${currentRole === r.role ? "bg-indigo-50/50 font-semibold" : ""}`}>
                  <td className="py-2.5 px-3 text-slate-900">{r.role}</td>
                  <td className="py-2.5 px-3">{r.live ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-300">✗</span>}</td>
                  <td className="py-2.5 px-3">{r.redrive ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-300">✗</span>}</td>
                  <td className="py-2.5 px-3">{r.block ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-300">✗</span>}</td>
                  <td className="py-2.5 px-3">{r.ai ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-300">✗</span>}</td>
                  <td className="py-2.5 px-3">{r.audit ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-300">✗</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Immutable Audit Trail Logs */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-600" />
              <span>Immutable Regulatory Audit Trail Logs</span>
            </h3>
            <p className="text-xs text-slate-500">
              Captures all user actions, DLQ re-drives, and fraud resolution status modifications.
            </p>
          </div>

          {canViewAudit && (
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs pl-9 pr-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        {!canViewAudit ? (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold">
              🔒
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">Audit Trail Access Restricted</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Role <span className="font-bold text-rose-700">{currentRole}</span> does not have regulatory compliance permissions to inspect immutable audit trail logs.
              </p>
              <p className="text-[11px] text-indigo-600 font-medium pt-1">
                Authorized Roles: Admin, Data Engineer, Auditor
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Audit ID & Time</th>
                  <th className="py-2.5 px-3">User & Role</th>
                  <th className="py-2.5 px-3">Action Type</th>
                  <th className="py-2.5 px-3">Action Details</th>
                  <th className="py-2.5 px-3">Client IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono">
                      <div className="font-bold text-slate-900">{log.id}</div>
                      <div className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{log.user}</div>
                      <div className="text-[10px] text-indigo-600 font-medium">{log.role}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-mono font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 font-medium">{log.details}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
