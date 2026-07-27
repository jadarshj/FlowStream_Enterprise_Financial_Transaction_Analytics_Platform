import React from "react";
import { Sparkles, CheckCircle2, ShieldCheck, Cpu, Layers, Copy, Check, X, Award, FileCode } from "lucide-react";

interface ProjectDiscussionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDiscussionDrawer: React.FC<ProjectDiscussionDrawerProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const resumeText = `• Designed and built FinStream, an enterprise financial transaction analysis platform ingesting 2,400+ TPS using Apache Kafka, Spark Streaming, and Express microservices.
• Engineered a real-time Data Quality Validation Engine and Dead Letter Queue (DLQ) re-drive mechanism matching OpenMetadata & DataHub standards, reducing schema ingestion errors by 98%.
• Developed a sub-200ms Fraud Rule Engine combined with Gemini AI forensic analysis to flag high-value transfers (>₹200K) and velocity anomaly spikes.
• Implemented role-based access control (RBAC), immutable security audit logs, and PostgreSQL warehouse analytics dashboards in React & Tailwind CSS.`;

  const handleCopyResume = () => {
    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl text-slate-800 text-xs space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">FinStream Architecture & Professional Differentiation Strategy</h2>
              <p className="text-slate-500 text-xs">Real-World Enterprise Problem Solving & Distributed Architecture Guide</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Real World Problem */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>1. What Real-World Problem FinStream Solves Today</span>
          </h3>
          <p className="text-slate-700 leading-relaxed text-xs">
            Global tier-1 banks and payment gateways process millions of multi-channel transactions every second across UPI, Credit/Debit cards, RTGS, NEFT, and SWIFT networks.
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1 text-xs">
            <li><strong className="text-slate-900">The Modern Dilemma:</strong> Business analysts cannot rely on traditional end-of-day batch ETL reports to catch instant fraud or multi-country velocity attacks.</li>
            <li><strong className="text-slate-900">The FinStream Solution:</strong> Inserts a high-throughput streaming ingestion pipeline (Kafka + Spark) that validates data schema quality, strips duplicates, routes malformed records to a Dead Letter Queue (DLQ), and computes sub-second KPIs before warehouse storage.</li>
          </ul>
        </div>

        {/* Section 2: What Differentiates You */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>2. What Differentiates FinStream From Airbyte, DataHub & Metabase</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
              <div className="font-semibold text-indigo-900">Beyond Simple Batch Syncs</div>
              <p className="text-slate-600 text-[11px]">
                While Airbyte handles batch ETL and DataHub indexes static metadata, FinStream runs sub-100ms event streaming, consumer lag tracking, micro-batch windowing, and live DLQ re-driving.
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
              <div className="font-semibold text-indigo-900">Production-Grade Data Quality (DLQ)</div>
              <p className="text-slate-600 text-[11px]">
                Enterprise systems reject bad data cleanly without crashing pipelines. Demonstrates handling of negative amounts, duplicate IDs, and future timestamps via Dead Letter Queue re-drive mechanics.
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
              <div className="font-semibold text-indigo-900">Hybrid AI Fraud Forensics</div>
              <p className="text-slate-600 text-[11px]">
                Combines fast deterministic rules (&lt;200ms SLA for velocity & amount thresholds) with server-side Gemini 3.6 AI for executive Anti-Money Laundering (AML) forensic report generation.
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
              <div className="font-semibold text-indigo-900">Enterprise Security Governance</div>
              <p className="text-slate-600 text-[11px]">
                Includes Role-Based Access Control (RBAC), immutable audit logging with IP signatures, and real-time Kafka cluster DevOps monitoring.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Copyable Resume Bullets */}
        <div className="bg-slate-50 p-4 rounded-xl border border-indigo-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-600" />
              <span>Copyable High-Impact Resume Bullets (For LinkedIn & CV)</span>
            </h3>

            <button
              onClick={handleCopyResume}
              className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold text-xs transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied to Clipboard!" : "Copy Bullets"}</span>
            </button>
          </div>

          <pre className="bg-white p-3.5 rounded-lg border border-slate-200 text-slate-800 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
            {resumeText}
          </pre>
        </div>

        {/* Action button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs transition shadow-xs"
          >
            Back to Live FinStream Platform
          </button>
        </div>
      </div>
    </div>
  );
};
