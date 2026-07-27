import React, { useState } from "react";
import {
  GitCommit,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Cpu,
  Shield,
  Activity,
  FileCode,
  HelpCircle,
  Sparkles,
  Server,
  Zap,
  Info
} from "lucide-react";

interface LineageNode {
  id: string;
  name: string;
  type: "Source" | "Ingestion" | "Validation" | "Transformation" | "Storage" | "Analytics";
  toolEquivalent: string;
  status: "Active" | "Healthy" | "Idle";
  schema: string;
  throughput: string;
  latency: string;
  description: string;
}

const LINEAGE_NODES: LineageNode[] = [
  {
    id: "node-1",
    name: "Payment Sources (UPI/SWIFT/Cards)",
    type: "Source",
    toolEquivalent: "Airbyte Connectors",
    status: "Active",
    schema: "PaymentPayload_v1 (sender, amount, merchant, method)",
    throughput: "2,450 TPS",
    latency: "2ms",
    description: "Multi-channel ingestion gateway receiving high-frequency events over TLS."
  },
  {
    id: "node-2",
    name: "Kafka Event Stream Cluster",
    type: "Ingestion",
    toolEquivalent: "Apache DolphinScheduler / Airbyte Queue",
    status: "Healthy",
    schema: "finstream.txns.v1 (Partitioned)",
    throughput: "2,450 TPS",
    latency: "4ms queue lag",
    description: "Distributed buffer topic ensuring zero message loss and message deduplication."
  },
  {
    id: "node-3",
    name: "Data Quality & Assertion Engine",
    type: "Validation",
    toolEquivalent: "OpenMetadata / DataHub Assertions",
    status: "Active",
    schema: "RuleContracts: [Amount > 0, Schema Match, Device Check]",
    throughput: "2,450 TPS",
    latency: "12ms",
    description: "Validates schema types; routes corrupt payloads to Dead Letter Queue (DLQ)."
  },
  {
    id: "node-4",
    name: "Spark Streaming & Fraud Scoring",
    type: "Transformation",
    toolEquivalent: "Marquez Job Lineage & Spark",
    status: "Active",
    schema: "EnrichedTxn (fraudScore, riskLevel, locationJurisdiction)",
    throughput: "2,410 TPS",
    latency: "100ms micro-batch",
    description: "Computes rolling 5-min velocity features and evaluates deterministic fraud rules."
  },
  {
    id: "node-5",
    name: "PostgreSQL Warehouse & Redis L1",
    type: "Storage",
    toolEquivalent: "DataHub Catalog / Warehouses",
    status: "Healthy",
    schema: "public.transactions (Indexed PK, FKs)",
    throughput: "2,410 TPS",
    latency: "14ms commit",
    description: "ACID persistent storage with in-memory Redis caching for ultra-fast query serving."
  },
  {
    id: "node-6",
    name: "AI Analytics & Metabase Layer",
    type: "Analytics",
    toolEquivalent: "Metabase / Apache Superset",
    status: "Active",
    schema: "Natural Language SQL Engine + Dynamic REST API",
    throughput: "Interactive",
    latency: "< 150ms UI render",
    description: "Serves executive KPI dashboards, AI fraud forensic reports, and automated SQL generation."
  }
];

export const PlatformComparisonAndLineage: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<LineageNode>(LINEAGE_NODES[2]);

  const COMPARISON_TABLE = [
    {
      category: "Data Lineage & Job Tracking",
      tools: "OpenLineage, Marquez, DataHub",
      standardScope: "Passive metadata harvesting, offline lineage graph rendering, static asset documentation.",
      finStreamDiff: "Real-time active stream lineage with inline schema enforcement, live consumer lag monitoring, and zero-downtime DLQ re-driving."
    },
    {
      category: "Data Quality & Cataloging",
      tools: "OpenMetadata, DataHub Assertions",
      standardScope: "Batch assertions, static quality dashboards, schema registries for offline databases.",
      finStreamDiff: "Sub-second stream validation (<15ms) that automatically intercepts bad records at the gateway and quarantines them into DLQ queues without pipeline failure."
    },
    {
      category: "ETL & Pipeline Workflow Orchestration",
      tools: "Airbyte, Apache DolphinScheduler",
      standardScope: "Scheduled batch syncs (hourly/daily), DAG workflow scheduling, connector configuration.",
      finStreamDiff: "Low-latency streaming event architecture (<100ms SLA) optimized for financial transactions with sub-200ms fraud detection and velocity tracking."
    },
    {
      category: "BI & Dashboard Analytics",
      tools: "Apache Superset, Metabase",
      standardScope: "Manual SQL querying, drag-and-drop chart builders, static caching layers.",
      finStreamDiff: "Combines Metabase-style clean business visualization with Gemini-powered Natural Language AI SQL generation and real-time live event streaming feeds."
    }
  ];

  return (
    <div id="platform-comparison-lineage-panel" className="space-y-6">
      {/* Top Banner: Ecosystem Architecture Positioning */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Ecosystem Architecture & Lineage
              </span>
              <span className="text-xs text-slate-500 font-mono">OpenLineage Spec Compliant</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Data Lineage & Ecosystem Technology Comparison
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              How FinStream unifies principles from DataHub, OpenMetadata, Metabase, Airbyte, and Apache Superset into a single high-throughput payment platform.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <Info className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Click any node in the DAG below to inspect its schema contract & job status.</span>
          </div>
        </div>

        {/* Interactive Data Lineage DAG Graph */}
        <div className="pt-6">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-indigo-600" />
            <span>Real-Time End-to-End Data Lineage DAG (OpenLineage Standard)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
            {LINEAGE_NODES.map((node, index) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <div key={node.id} className="relative flex flex-col">
                  <button
                    onClick={() => setSelectedNode(node)}
                    className={`p-3.5 rounded-xl text-left border transition-all h-full flex flex-col justify-between ${
                      isSelected
                        ? "bg-indigo-50/80 border-indigo-500 shadow-sm text-slate-900 ring-2 ring-indigo-500/20"
                        : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50/80"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100/80 px-1.5 py-0.5 rounded">
                          0{index + 1}. {node.type}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      </div>
                      <div className="font-semibold text-xs text-slate-900 leading-snug">
                        {node.name}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">
                        {node.toolEquivalent}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className="font-mono text-slate-600 font-medium">{node.throughput}</span>
                      <span className="text-emerald-600 font-semibold">{node.latency}</span>
                    </div>
                  </button>

                  {index < LINEAGE_NODES.length - 1 && (
                    <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Lineage Node Metadata Detail Box */}
          {selectedNode && (
            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-indigo-100 text-indigo-700 font-mono text-[11px]">
                    {selectedNode.id}
                  </span>
                  <span>{selectedNode.name}</span>
                  <span className="text-slate-500 font-normal">({selectedNode.toolEquivalent})</span>
                </div>
                <span className="text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px]">
                  Status: {selectedNode.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div>
                  <span className="text-slate-500 font-semibold block mb-0.5">Schema & Payload Contract:</span>
                  <code className="text-indigo-800 bg-white border border-slate-200 p-1.5 rounded block font-mono text-[11px]">
                    {selectedNode.schema}
                  </code>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block mb-0.5">Pipeline Performance:</span>
                  <div className="text-slate-800 font-mono font-medium">
                    Throughput: {selectedNode.throughput} | Latency: {selectedNode.latency}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block mb-0.5">Functional Role:</span>
                  <div className="text-slate-700">{selectedNode.description}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feature Comparison Matrix: FinStream vs. Industry Tools */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>FinStream Architectural Differentiators Matrix</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative analysis demonstrating how FinStream builds upon concepts from DataHub, OpenMetadata, Airbyte, Metabase & Apache Superset.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-1/5">Functional Dimension</th>
                <th className="py-3 px-4 w-1/4">Industry Standard Tools</th>
                <th className="py-3 px-4 w-1/3">Traditional Scope & Limitations</th>
                <th className="py-3 px-4 bg-indigo-50/50 text-indigo-900">FinStream Innovation & Edge</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
              {COMPARISON_TABLE.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/30">
                    {row.category}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-indigo-700 font-medium">
                    {row.tools}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 leading-relaxed text-[11px]">
                    {row.standardScope}
                  </td>
                  <td className="py-3.5 px-4 bg-indigo-50/20 text-slate-900 font-medium leading-relaxed text-[11px] border-l border-indigo-100">
                    <span className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{row.finStreamDiff}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
