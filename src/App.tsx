import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { KPIOverview } from "./components/KPIOverview";
import { LiveStreamFeed } from "./components/LiveStreamFeed";
import { DataValidationDLQ } from "./components/DataValidationDLQ";
import { FraudDetectionPanel } from "./components/FraudDetectionPanel";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { PipelineHealth } from "./components/PipelineHealth";
import { AuditLogAndRBAC } from "./components/AuditLogAndRBAC";
import { PlatformComparisonAndLineage } from "./components/PlatformComparisonAndLineage";
import { CSVIngestModal } from "./components/CSVIngestModal";
import { ProjectDiscussionDrawer } from "./components/ProjectDiscussionDrawer";
import { TransactionModal } from "./components/TransactionModal";

import {
  Transaction,
  DLQRecord,
  FraudAlert,
  AuditLog,
  PipelineMetrics,
  UserRole,
  HourlyRevenue,
  ChannelDistribution,
  TopMerchant,
  CountrySpend,
} from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentRole, setCurrentRole] = useState<UserRole>("Admin");
  const [isStreaming, setIsStreaming] = useState(true);
  const [streamSpeed, setStreamSpeed] = useState(1);

  // Modals
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);
  const [inspectedTxn, setInspectedTxn] = useState<Transaction | null>(null);

  // Data Stores
  const [metrics, setMetrics] = useState<PipelineMetrics>({
    todayVolume: 3241092,
    todayRevenueINR: 84520900,
    fraudAlertsCount: 2,
    failedTransactionsCount: 45,
    processingLatencyMs: 118,
    pipelineHealth: "HEALTHY",
    kafkaQueueSize: 1240,
    sparkThroughputTps: 2450,
    dbResponseTimeMs: 14,
    redisCacheHitRate: 98.4,
    dataQualityStats: {
      acceptedPct: 96.2,
      duplicatePct: 1.4,
      missingFieldsPct: 0.9,
      invalidPct: 1.5,
    },
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dlqRecords, setDlqRecords] = useState<DLQRecord[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Analytics Data
  const [hourlyRevenue, setHourlyRevenue] = useState<HourlyRevenue[]>([]);
  const [channelDistribution, setChannelDistribution] = useState<ChannelDistribution[]>([]);
  const [topMerchants, setTopMerchants] = useState<TopMerchant[]>([]);
  const [countrySpend, setCountrySpend] = useState<CountrySpend[]>([]);

  // Initial Fetch from Express API
  const fetchData = async () => {
    try {
      const [txnsRes, dlqRes, fraudRes, analyticsRes, auditRes] = await Promise.all([
        fetch("/api/transactions?limit=50"),
        fetch("/api/dlq"),
        fetch("/api/frauds"),
        fetch("/api/analytics"),
        fetch("/api/audit-logs"),
      ]);

      if (txnsRes.ok) {
        const data = await txnsRes.json();
        setTransactions(data.transactions || []);
      }
      if (dlqRes.ok) {
        const data = await dlqRes.json();
        setDlqRecords(data.records || []);
      }
      if (fraudRes.ok) {
        const data = await fraudRes.json();
        setFraudAlerts(data.alerts || []);
      }
      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        if (data.metrics) setMetrics(data.metrics);
        if (data.hourlyRevenue) setHourlyRevenue(data.hourlyRevenue);
        if (data.channelDistribution) setChannelDistribution(data.channelDistribution);
        if (data.topMerchants) setTopMerchants(data.topMerchants);
        if (data.countrySpend) setCountrySpend(data.countrySpend);
      }
      if (auditRes.ok) {
        const data = await auditRes.json();
        setAuditLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to load initial pipeline data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Live Real-Time Transaction Streaming Generator Simulation
  useEffect(() => {
    if (!isStreaming) return;

    const intervalTime = Math.max(800 / streamSpeed, 300);
    const interval = setInterval(async () => {
      // Simulate incoming event from Kafka queue
      const senders = ["Amit Shah", "Pooja Hegde", "Karan Johar", "Anushka Sharma", "Rohan Mehta", "Sanjay Dutt", "Neha Kakkar"];
      const merchants = ["Amazon Pay", "Swiggy", "Flipkart", "Uber India", "Zomato", "BookMyShow", "MakeMyTrip"];
      const methods = ["UPI", "Credit Card", "Debit Card", "NEFT", "RTGS", "SWIFT"];
      const locations = ["Mumbai, India", "Delhi, India", "Bengaluru, India", "Hyderabad, India", "London, UK"];

      const randomSender = senders[Math.floor(Math.random() * senders.length)];
      const randomMerchant = merchants[Math.floor(Math.random() * merchants.length)];
      const randomMethod = methods[Math.floor(Math.random() * methods.length)];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      const randomAmount = Math.floor(Math.random() * 45000) + 150;

      try {
        const res = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: randomSender,
            amount: randomAmount,
            merchant: randomMerchant,
            paymentMethod: randomMethod,
            location: randomLocation,
            currency: "INR",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.transaction) {
            setTransactions((prev) => [data.transaction, ...prev.slice(0, 49)]);
            // Increment ticker
            setMetrics((prev) => ({
              ...prev,
              todayVolume: prev.todayVolume + 1,
              todayRevenueINR: prev.todayRevenueINR + randomAmount,
            }));
          }
        }
      } catch (e) {
        // Silent catch for stream heartbeat
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isStreaming, streamSpeed]);

  // Handle manual test ingestion
  const handleAddTransaction = async (txnData: Partial<Transaction>) => {
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txnData),
      });

      const data = await res.json();
      if (res.ok && data.transaction) {
        setTransactions((prev) => [data.transaction, ...prev]);
        setMetrics((prev) => ({
          ...prev,
          todayVolume: prev.todayVolume + 1,
          todayRevenueINR: prev.todayRevenueINR + (txnData.amount || 0),
        }));
      } else if (data.status === "REJECTED_TO_DLQ") {
        fetchData(); // refresh DLQ table
        alert(`Validation Rule Failed! Payload directed to DLQ with ID: ${data.dlqId}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Simulate High-Velocity Fraud Attack Spike
  const handleSimulateSpike = async () => {
    alert("⚡ Simulating high-velocity cross-border fraud attack (5 transfers > ₹350K within 10s)...");
    for (let i = 0; i < 3; i++) {
      await handleAddTransaction({
        sender: "Attacker-Account-Bot-881",
        amount: 380000 + i * 20000,
        merchant: "CryptoGlobal Forex Shell",
        paymentMethod: "RTGS",
        location: "Lagos, Nigeria",
        currency: "INR",
      });
    }
    // Refresh alerts & metrics
    fetchData();
  };

  // Handle DLQ Re-drive
  const handleRedriveDLQ = async (id: string) => {
    try {
      const res = await fetch("/api/dlq/redrive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: currentRole }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Fraud Resolution
  const handleResolveAlert = async (id: string, action: "BLOCKED" | "APPROVED", notes?: string) => {
    try {
      const res = await fetch(`/api/frauds/${id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, notes, role: currentRole }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Gemini AI Forensic Call
  const handleExplainFraudAI = async (alertId: string) => {
    const res = await fetch("/api/ai/explain-fraud", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alertId }),
    });
    const data = await res.json();
    return data.explanation || "No explanation available.";
  };

  // Handle Natural Language SQL Call
  const handleRunAiSql = async (prompt: string) => {
    const res = await fetch("/api/ai/sql-query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPrompt: prompt }),
    });
    const data = await res.json();
    return {
      sql: data.sql || "SELECT * FROM transactions LIMIT 10;",
      insights: data.insights || data.explanation || "Executed analytics query against PostgreSQL warehouse.",
    };
  };

  // Handle Batch CSV Upload
  const handleBatchCsvIngest = async (csvText: string) => {
    const lines = csvText.trim().split("\n").slice(1); // skip header
    for (const line of lines) {
      const parts = line.split(",");
      if (parts.length >= 2) {
        const sender = parts[0]?.trim();
        const amount = parseFloat(parts[1]?.trim() || "0");
        const merchant = parts[2]?.trim() || "Batch Ingest";
        const paymentMethod = parts[3]?.trim() || "UPI";
        const location = parts[4]?.trim() || "Mumbai, India";

        await handleAddTransaction({
          sender,
          amount,
          merchant,
          paymentMethod,
          location,
          currency: "INR",
        });
      }
    }
    fetchData();
  };

  return (
    <div id="finstream-app-container" className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Platform Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        isStreaming={isStreaming}
        onToggleStreaming={() => setIsStreaming(!isStreaming)}
        streamSpeed={streamSpeed}
        onChangeSpeed={setStreamSpeed}
        onSimulateSpike={handleSimulateSpike}
        onOpenCsvModal={() => setIsCsvModalOpen(true)}
        onOpenDiscussion={() => setIsDiscussionOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Workspace Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Top Executive KPI Bar */}
        <KPIOverview metrics={metrics} />

        {/* Tab View Router */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <LiveStreamFeed
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              onInspectTransaction={(t) => setInspectedTxn(t)}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FraudDetectionPanel
                alerts={fraudAlerts}
                currentRole={currentRole}
                onResolveAlert={handleResolveAlert}
                onExplainFraudAI={handleExplainFraudAI}
              />
              <DataValidationDLQ
                dlqRecords={dlqRecords}
                dataQualityStats={metrics.dataQualityStats}
                currentRole={currentRole}
                onRedriveRecord={handleRedriveDLQ}
              />
            </div>
          </div>
        )}

        {activeTab === "comparison" && <PlatformComparisonAndLineage />}

        {activeTab === "livestream" && (
          <LiveStreamFeed
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onInspectTransaction={(t) => setInspectedTxn(t)}
          />
        )}

        {activeTab === "validation" && (
          <DataValidationDLQ
            dlqRecords={dlqRecords}
            dataQualityStats={metrics.dataQualityStats}
            currentRole={currentRole}
            onRedriveRecord={handleRedriveDLQ}
          />
        )}

        {activeTab === "fraud" && (
          <FraudDetectionPanel
            alerts={fraudAlerts}
            currentRole={currentRole}
            onResolveAlert={handleResolveAlert}
            onExplainFraudAI={handleExplainFraudAI}
          />
        )}

        {activeTab === "analytics" && (
          <AnalyticsDashboard
            hourlyRevenue={hourlyRevenue}
            channelDistribution={channelDistribution}
            topMerchants={topMerchants}
            countrySpend={countrySpend}
            onRunAiSql={handleRunAiSql}
          />
        )}

        {activeTab === "pipeline" && <PipelineHealth metrics={metrics} />}

        {activeTab === "audit" && (
          <AuditLogAndRBAC auditLogs={auditLogs} currentRole={currentRole} onRoleChange={setCurrentRole} />
        )}
      </main>

      {/* Modals & Drawers */}
      <CSVIngestModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onBatchIngest={handleBatchCsvIngest}
      />

      <ProjectDiscussionDrawer
        isOpen={isDiscussionOpen}
        onClose={() => setIsDiscussionOpen(false)}
      />

      <TransactionModal
        transaction={inspectedTxn}
        onClose={() => setInspectedTxn(null)}
      />
    </div>
  );
}
