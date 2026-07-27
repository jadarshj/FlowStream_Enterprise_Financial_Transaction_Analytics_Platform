import React from "react";
import { PipelineMetrics } from "../types";
import { Cpu, Server, Activity, Database, Zap, Layers, Shield, CheckCircle2 } from "lucide-react";

interface PipelineHealthProps {
  metrics: PipelineMetrics;
}

export const PipelineHealth: React.FC<PipelineHealthProps> = ({ metrics }) => {
  return (
    <div id="pipeline-health-panel" className="space-y-6">
      {/* Top Telemetry KPI Cards */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <span>Pipeline DevOps Monitoring & Cluster Telemetry (Airbyte & Airflow Pattern)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time telemetry tracking Kafka queue backlog depth, Spark micro-batch throughput, and DB write latencies.
            </p>
          </div>

          <span className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Pipeline Status: HEALTHY</span>
          </span>
        </div>

        {/* Real-Time Telemetry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 font-mono">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-[11px] text-slate-500 font-sans mb-1">Kafka Queue Backlog</div>
            <div className="text-xl font-bold text-indigo-600">
              {metrics.kafkaQueueSize.toLocaleString()} <span className="text-xs font-normal text-slate-500">msgs</span>
            </div>
            <div className="text-[10px] text-emerald-600 font-sans mt-1">Zero consumer lag</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-[11px] text-slate-500 font-sans mb-1">Spark Throughput</div>
            <div className="text-xl font-bold text-slate-900">
              {metrics.sparkThroughputTps.toLocaleString()} <span className="text-xs font-normal text-slate-500">TPS</span>
            </div>
            <div className="text-[10px] text-indigo-600 font-sans mt-1">Micro-batch: 100ms</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-[11px] text-slate-500 font-sans mb-1">API Latency</div>
            <div className="text-xl font-bold text-emerald-600">
              {metrics.processingLatencyMs} <span className="text-xs font-normal text-slate-500">ms</span>
            </div>
            <div className="text-[10px] text-emerald-600 font-sans mt-1">SLA: &lt; 200ms</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-[11px] text-slate-500 font-sans mb-1">Postgres Write Time</div>
            <div className="text-xl font-bold text-slate-900">
              {metrics.dbResponseTimeMs} <span className="text-xs font-normal text-slate-500">ms</span>
            </div>
            <div className="text-[10px] text-slate-500 font-sans mt-1">Pool Size: 32</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-[11px] text-slate-500 font-sans mb-1">Redis L1 Cache Hit</div>
            <div className="text-xl font-bold text-amber-600">
              {metrics.redisCacheHitRate}%
            </div>
            <div className="text-[10px] text-amber-700 font-sans mt-1">In-Memory Active</div>
          </div>
        </div>
      </div>

      {/* End-To-End Architecture Pipeline Node Graph */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>Distributed Streaming Architecture Topology</span>
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          High-availability distributed streaming pipeline matching tier-1 global enterprise & payment gateway specifications.
        </p>

        {/* Node Graph Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-xs font-sans">
          {/* Node 1: Sources */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between hover:border-indigo-400 transition">
            <div>
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold mb-1">
                <Zap className="w-4 h-4" />
                <span>1. Sources</span>
              </div>
              <p className="text-[11px] text-slate-600">UPI, Credit Cards, SWIFT, REST API & CSV Ingest</p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-500 font-mono">
              2,450 txns / sec
            </div>
          </div>

          {/* Node 2: Kafka Queue */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between hover:border-indigo-400 transition">
            <div>
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold mb-1">
                <Server className="w-4 h-4" />
                <span>2. Kafka Queue</span>
              </div>
              <p className="text-[11px] text-slate-600">Apache Kafka 3-Node Cluster, Partitioned Topics</p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-emerald-600 font-mono">
              Lag: 4ms
            </div>
          </div>

          {/* Node 3: Spark Engine */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between hover:border-indigo-400 transition">
            <div>
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold mb-1">
                <Cpu className="w-4 h-4" />
                <span>3. Spark Stream</span>
              </div>
              <p className="text-[11px] text-slate-600">Spark Structured Streaming Transformation Engine</p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-indigo-600 font-mono">
              Window: 100ms
            </div>
          </div>

          {/* Node 4: Validation & DLQ */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between hover:border-amber-400 transition">
            <div>
              <div className="flex items-center gap-1.5 text-amber-700 font-bold mb-1">
                <Shield className="w-4 h-4" />
                <span>4. Rules & DLQ</span>
              </div>
              <p className="text-[11px] text-slate-600">Schema Validator, Fraud Rules & Dead Letter Queue</p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-amber-700 font-mono">
              96.2% Accepted
            </div>
          </div>

          {/* Node 5: Postgres Warehouse */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between hover:border-emerald-400 transition">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
                <Database className="w-4 h-4" />
                <span>5. Warehouse</span>
              </div>
              <p className="text-[11px] text-slate-600">PostgreSQL Warehouse + Redis Cache Layer</p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-emerald-600 font-mono">
              14ms Commit Latency
            </div>
          </div>

          {/* Node 6: React Dashboard */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between hover:border-indigo-400 transition">
            <div>
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold mb-1">
                <Activity className="w-4 h-4" />
                <span>6. Analytics UI</span>
              </div>
              <p className="text-[11px] text-slate-600">React + Express Microservices API Dashboard</p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-indigo-600 font-mono">
              Live Real-Time
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
