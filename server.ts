import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client server-side
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

// Initial Mock Seed Data
interface Transaction {
  id: string;
  timestamp: string;
  sender: string;
  receiver: string;
  amount: number;
  currency: string;
  merchant: string;
  category: string;
  location: string;
  paymentMethod: string;
  status: "SUCCESS" | "FAILED" | "FLAGGED" | "PENDING";
  fraudScore: number;
  fraudReason?: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  ipAddress: string;
  deviceId: string;
  accountNumber: string;
}

interface DLQRecord {
  id: string;
  timestamp: string;
  rawPayload: any;
  failureReason: string;
  errorCode: string;
  source: string;
  status: "UNRESOLVED" | "REDRIVEN" | "DISCARDED";
}

interface FraudAlert {
  id: string;
  transactionId: string;
  timestamp: string;
  customerName: string;
  amount: number;
  currency: string;
  merchant: string;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  triggeredRules: string[];
  status: "OPEN" | "INVESTIGATING" | "BLOCKED" | "APPROVED";
  fraudScore: number;
  location: string;
  paymentMethod: string;
  aiExplanation?: string;
}

interface AuditLog {
  id: string;
  user: string;
  role: string;
  timestamp: string;
  action: string;
  ip: string;
  details: string;
}

// In-Memory Data Stores for Live Demo
let transactions: Transaction[] = [
  {
    id: "TXN-8849201",
    timestamp: new Date(Date.now() - 1000 * 30).toISOString(),
    sender: "Rahul Sharma",
    receiver: "Amazon Pay Merchant",
    amount: 14999,
    currency: "INR",
    merchant: "Amazon India",
    category: "Electronics",
    location: "Mumbai, India",
    paymentMethod: "UPI",
    status: "SUCCESS",
    fraudScore: 12,
    riskLevel: "LOW",
    ipAddress: "103.22.41.12",
    deviceId: "DEV-MAC-9821",
    accountNumber: "ACC-IN-908123"
  },
  {
    id: "TXN-8849202",
    timestamp: new Date(Date.now() - 1000 * 120).toISOString(),
    sender: "Aarav Patel",
    receiver: "Global Luxury Crypto Exchange",
    amount: 350000,
    currency: "INR",
    merchant: "CryptoGlobal Ltd",
    category: "Financial Services",
    location: "Lagos, Nigeria",
    paymentMethod: "RTGS",
    status: "FLAGGED",
    fraudScore: 88,
    fraudReason: "Amount exceeds ₹200,000 & Suspicious Country IP mismatch",
    riskLevel: "HIGH",
    ipAddress: "197.210.44.89",
    deviceId: "DEV-ANDROID-0012",
    accountNumber: "ACC-IN-112009"
  },
  {
    id: "TXN-8849203",
    timestamp: new Date(Date.now() - 1000 * 200).toISOString(),
    sender: "Priya Singh",
    receiver: "Starbucks Coffee",
    amount: 450,
    currency: "INR",
    merchant: "Starbucks India",
    category: "Food & Beverage",
    location: "Bengaluru, India",
    paymentMethod: "Credit Card",
    status: "SUCCESS",
    fraudScore: 5,
    riskLevel: "LOW",
    ipAddress: "49.207.211.18",
    deviceId: "DEV-IPHONE-7721",
    accountNumber: "ACC-IN-556123"
  },
  {
    id: "TXN-8849204",
    timestamp: new Date(Date.now() - 1000 * 350).toISOString(),
    sender: "David Miller",
    receiver: "SWIFT Overseas Wire",
    amount: 820000,
    currency: "INR",
    merchant: "HighRisk Overseas Forex",
    category: "International Wire",
    location: "London, UK",
    paymentMethod: "SWIFT",
    status: "FLAGGED",
    fraudScore: 92,
    fraudReason: "Rapid multi-country velocity (5 transactions in 20s)",
    riskLevel: "HIGH",
    ipAddress: "185.220.101.4",
    deviceId: "DEV-WIN-3321",
    accountNumber: "ACC-UK-441029"
  },
  {
    id: "TXN-8849205",
    timestamp: new Date(Date.now() - 1000 * 500).toISOString(),
    sender: "Vikram Malhotra",
    receiver: "Flipkart Internet",
    amount: 2490,
    currency: "INR",
    merchant: "Flipkart",
    category: "Retail",
    location: "Delhi, India",
    paymentMethod: "Internet Banking",
    status: "SUCCESS",
    fraudScore: 8,
    riskLevel: "LOW",
    ipAddress: "122.160.18.91",
    deviceId: "DEV-MAC-1102",
    accountNumber: "ACC-IN-889123"
  }
];

let deadLetterQueue: DLQRecord[] = [
  {
    id: "DLQ-901",
    timestamp: new Date(Date.now() - 1000 * 180).toISOString(),
    rawPayload: { sender: "Anonymous", amount: -500, currency: "INR", paymentMethod: "NEFT" },
    failureReason: "Negative transaction amount (-500) violates schema rule",
    errorCode: "ERR_NEGATIVE_AMOUNT",
    source: "Kafka-Ingestion-Topic-01",
    status: "UNRESOLVED"
  },
  {
    id: "DLQ-902",
    timestamp: new Date(Date.now() - 1000 * 420).toISOString(),
    rawPayload: { txnId: "TXN-8849201", amount: 1500, currency: "XYZ" },
    failureReason: "Duplicate Transaction ID & Unrecognized ISO Currency 'XYZ'",
    errorCode: "ERR_INVALID_CURRENCY",
    source: "Kafka-Ingestion-Topic-02",
    status: "UNRESOLVED"
  },
  {
    id: "DLQ-903",
    timestamp: new Date(Date.now() - 1000 * 900).toISOString(),
    rawPayload: { sender: "Karan Johar", timestamp: "2030-01-01T00:00:00Z", amount: 25000 },
    failureReason: "Future timestamp payload rejected by temporal validation filter",
    errorCode: "ERR_FUTURE_TIMESTAMP",
    source: "Kafka-Ingestion-Topic-01",
    status: "UNRESOLVED"
  }
];

let fraudAlerts: FraudAlert[] = [
  {
    id: "FRD-1001",
    transactionId: "TXN-8849202",
    timestamp: new Date(Date.now() - 1000 * 120).toISOString(),
    customerName: "Aarav Patel",
    amount: 350000,
    currency: "INR",
    merchant: "CryptoGlobal Ltd",
    riskLevel: "HIGH",
    triggeredRules: ["Amount > ₹2,00,000", "High-risk merchant domain", "Cross-border IP anomaly (Nigeria)"],
    status: "INVESTIGATING",
    fraudScore: 88,
    location: "Lagos, Nigeria",
    paymentMethod: "RTGS"
  },
  {
    id: "FRD-1002",
    transactionId: "TXN-8849204",
    timestamp: new Date(Date.now() - 1000 * 350).toISOString(),
    customerName: "David Miller",
    amount: 820000,
    currency: "INR",
    merchant: "HighRisk Overseas Forex",
    riskLevel: "HIGH",
    triggeredRules: ["5 transactions within 20 seconds", "Velocity Burst Spike", "High Risk SWIFT Transfer"],
    status: "OPEN",
    fraudScore: 92,
    location: "London, UK",
    paymentMethod: "SWIFT"
  }
];

let auditLogs: AuditLog[] = [
  {
    id: "AUD-501",
    user: "admin@enterprise.com",
    role: "Admin",
    timestamp: new Date(Date.now() - 1000 * 60).toISOString(),
    action: "UPDATE_FRAUD_RULE",
    ip: "10.0.4.15",
    details: "Adjusted velocity trigger limit to 5 txns / 20 seconds"
  },
  {
    id: "AUD-502",
    user: "dataeng@finstream.io",
    role: "Data Engineer",
    timestamp: new Date(Date.now() - 1000 * 300).toISOString(),
    action: "REDRIVE_DLQ",
    ip: "10.0.2.88",
    details: "Re-driven 12 batch messages from Dead Letter Queue after schema patch"
  }
];

// Helper: Seed initial metrics
const getPipelineMetrics = () => {
  return {
    todayVolume: 3241092,
    todayRevenueINR: 84520900,
    fraudAlertsCount: fraudAlerts.length,
    failedTransactionsCount: deadLetterQueue.length + 42,
    processingLatencyMs: 118,
    pipelineHealth: "HEALTHY" as const,
    kafkaQueueSize: 1240,
    sparkThroughputTps: 2450,
    dbResponseTimeMs: 14,
    redisCacheHitRate: 98.4,
    dataQualityStats: {
      acceptedPct: 96.2,
      duplicatePct: 1.4,
      missingFieldsPct: 0.9,
      invalidPct: 1.5,
    }
  };
};

// --- API ENDPOINTS ---

// Healthcheck
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", system: "FinStream Enterprise Pipeline Engine", timestamp: new Date() });
});

// GET /api/transactions
app.get("/api/transactions", (req, res) => {
  const { limit = "50", search = "", paymentMethod = "" } = req.query;
  let result = [...transactions];

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(
      t => t.id.toLowerCase().includes(q) ||
           t.sender.toLowerCase().includes(q) ||
           t.merchant.toLowerCase().includes(q)
    );
  }

  if (paymentMethod) {
    result = result.filter(t => t.paymentMethod === paymentMethod);
  }

  const numLimit = parseInt(String(limit), 10) || 50;
  res.json({
    total: result.length,
    transactions: result.slice(0, numLimit)
  });
});

// POST /api/transactions (Ingest single transaction)
app.post("/api/transactions", (req, res) => {
  const body = req.body;

  // Real-time Data Validation Engine
  const errors: string[] = [];
  if (!body.amount || body.amount <= 0) errors.push("Amount must be greater than zero");
  if (!body.sender) errors.push("Missing required field: sender");
  if (!body.paymentMethod) errors.push("Missing required field: paymentMethod");
  if (body.currency && body.currency !== "INR" && body.currency !== "USD" && body.currency !== "EUR" && body.currency !== "GBP") {
    errors.push(`Invalid ISO Currency: ${body.currency}`);
  }

  if (errors.length > 0) {
    // Send to Dead Letter Queue
    const newDlq: DLQRecord = {
      id: `DLQ-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      rawPayload: body,
      failureReason: errors.join(" | "),
      errorCode: "ERR_VALIDATION_FAILED",
      source: "REST_INGEST_API",
      status: "UNRESOLVED"
    };
    deadLetterQueue.unshift(newDlq);

    return res.status(400).json({
      status: "REJECTED_TO_DLQ",
      message: "Data validation failed. Record appended to Dead Letter Queue.",
      dlqId: newDlq.id,
      errors
    });
  }

  // Fraud Engine Calculation
  let fraudScore = Math.floor(Math.random() * 20);
  const rulesTriggered: string[] = [];

  if (body.amount > 200000) {
    fraudScore += 50;
    rulesTriggered.push("Amount exceeds ₹2,00,000 threshold");
  }

  if (body.location && (body.location.includes("Nigeria") || body.location.includes("Russia") || body.location.includes("Cayman"))) {
    fraudScore += 35;
    rulesTriggered.push("High-risk jurisdiction IP match");
  }

  let riskLevel: "LOW" | "MEDIUM" | "HIGH" = "LOW";
  let status: "SUCCESS" | "FLAGGED" = "SUCCESS";

  if (fraudScore >= 75) {
    riskLevel = "HIGH";
    status = "FLAGGED";
  } else if (fraudScore >= 40) {
    riskLevel = "MEDIUM";
  }

  const newTxn: Transaction = {
    id: body.id || `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
    timestamp: new Date().toISOString(),
    sender: body.sender,
    receiver: body.receiver || body.merchant || "Merchant Account",
    amount: Number(body.amount),
    currency: body.currency || "INR",
    merchant: body.merchant || "Direct Transfer",
    category: body.category || "General",
    location: body.location || "Mumbai, India",
    paymentMethod: body.paymentMethod,
    status,
    fraudScore,
    fraudReason: rulesTriggered.join(" | ") || undefined,
    riskLevel,
    ipAddress: body.ipAddress || "103.44.12.90",
    deviceId: body.deviceId || "DEV-WEB-9912",
    accountNumber: body.accountNumber || `ACC-IN-${Math.floor(100000 + Math.random() * 900000)}`
  };

  transactions.unshift(newTxn);

  if (riskLevel === "HIGH" || riskLevel === "MEDIUM") {
    const alert: FraudAlert = {
      id: `FRD-${Date.now().toString().slice(-4)}`,
      transactionId: newTxn.id,
      timestamp: newTxn.timestamp,
      customerName: newTxn.sender,
      amount: newTxn.amount,
      currency: newTxn.currency,
      merchant: newTxn.merchant,
      riskLevel,
      triggeredRules: rulesTriggered.length ? rulesTriggered : ["Anomalous transaction volume"],
      status: "OPEN",
      fraudScore,
      location: newTxn.location,
      paymentMethod: newTxn.paymentMethod
    };
    fraudAlerts.unshift(alert);
  }

  res.status(201).json({
    status: "PROCESSED",
    transaction: newTxn
  });
});

// GET /api/dlq
app.get("/api/dlq", (_req, res) => {
  res.json({
    total: deadLetterQueue.length,
    records: deadLetterQueue
  });
});

// POST /api/dlq/redrive
app.post("/api/dlq/redrive", (req, res) => {
  const { id, role } = req.body;
  const item = deadLetterQueue.find(d => d.id === id);
  if (!item) {
    return res.status(404).json({ error: "DLQ record not found" });
  }

  item.status = "REDRIVEN";

  // Reprocess item into transactions if sanitized
  const payload = item.rawPayload || {};
  const newTxn: Transaction = {
    id: `TXN-REDRIVEN-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    sender: payload.sender || "Sanitized Customer",
    receiver: "System Restored Account",
    amount: Math.abs(Number(payload.amount)) || 1000,
    currency: "INR",
    merchant: "Redriven Merchant",
    category: "Restored",
    location: "Mumbai, India",
    paymentMethod: payload.paymentMethod || "NEFT",
    status: "SUCCESS",
    fraudScore: 10,
    riskLevel: "LOW",
    ipAddress: "10.0.0.1",
    deviceId: "DEV-SYSTEM-DLQ",
    accountNumber: "ACC-RESTORED-01"
  };

  transactions.unshift(newTxn);

  auditLogs.unshift({
    id: `AUD-${Date.now().toString().slice(-4)}`,
    user: `${(role || "Data Engineer").toLowerCase().replace(/\s+/g, '')}@finstream.io`,
    role: role || "Data Engineer",
    timestamp: new Date().toISOString(),
    action: "REDRIVE_DLQ_RECORD",
    ip: "10.0.2.14",
    details: `Re-driven record ${id} into active transaction pipeline`
  });

  res.json({ success: true, message: `DLQ ${id} redriven successfully`, transaction: newTxn });
});

// GET /api/frauds
app.get("/api/frauds", (_req, res) => {
  res.json({
    total: fraudAlerts.length,
    alerts: fraudAlerts
  });
});

// POST /api/frauds/:id/resolve
app.post("/api/frauds/:id/resolve", (req, res) => {
  const { id } = req.params;
  const { action, notes, role } = req.body; // "BLOCKED" | "APPROVED"

  const alert = fraudAlerts.find(f => f.id === id);
  if (!alert) {
    return res.status(404).json({ error: "Fraud alert not found" });
  }

  alert.status = action === "BLOCKED" ? "BLOCKED" : "APPROVED";

  // Update underlying transaction status
  const txn = transactions.find(t => t.id === alert.transactionId);
  if (txn) {
    txn.status = action === "BLOCKED" ? "FAILED" : "SUCCESS";
  }

  auditLogs.unshift({
    id: `AUD-${Date.now().toString().slice(-4)}`,
    user: `${(role || "Analyst").toLowerCase().replace(/\s+/g, '')}@enterprise.com`,
    role: role || "Analyst",
    timestamp: new Date().toISOString(),
    action: `FRAUD_ALERT_${action}`,
    ip: "10.0.8.22",
    details: `Fraud Alert ${id} set to ${action}. Notes: ${notes || "No notes provided"}`
  });

  res.json({ success: true, alert, transaction: txn });
});

// POST /api/ai/explain-fraud (Server-Side Gemini AI Forensic Analysis)
app.post("/api/ai/explain-fraud", async (req, res) => {
  const { alertId } = req.body;
  const alert = fraudAlerts.find(a => a.id === alertId);
  const txn = alert ? transactions.find(t => t.id === alert.transactionId) : null;

  if (!alert) {
    return res.status(404).json({ error: "Alert not found" });
  }

  const ai = getAiClient();
  if (!ai) {
    // Provide structured fallback report if key is not attached yet
    return res.json({
      alertId,
      explanation: `**Automated Forensic Risk Report (FinStream Rule Engine)**\n\n` +
        `• **Transaction Reference**: ${alert.transactionId} (${alert.amount} ${alert.currency})\n` +
        `• **Risk Score**: ${alert.fraudScore}/100 [${alert.riskLevel}]\n` +
        `• **Triggered Anomaly Rules**:\n` +
        alert.triggeredRules.map(r => `  - ${r}`).join("\n") +
        `\n\n**Key Vulnerability Indicators**:\n` +
        `1. Velocity / Location Mismatch: Request originated from IP address in ${alert.location}.\n` +
        `2. High Value Transfer: Payment method ${alert.paymentMethod} requested for merchant '${alert.merchant}'.\n\n` +
        `**Recommended Compliance Action**: Require 2FA STEP-UP verification or freeze beneficiary account ACC-IN-**** before settlement.`
    });
  }

  try {
    const prompt = `You are a Lead Financial Fraud Investigator and Anti-Money Laundering (AML) Compliance Specialist at an enterprise bank.
Analyze the following flagged suspicious financial transaction and provide an executive forensic report.

Transaction Details:
- ID: ${alert.transactionId}
- Customer: ${alert.customerName}
- Amount: ${alert.amount} ${alert.currency}
- Payment Method: ${alert.paymentMethod}
- Merchant/Beneficiary: ${alert.merchant}
- Location / IP: ${alert.location} (IP: ${txn?.ipAddress || "Unknown"})
- Risk Score: ${alert.fraudScore} / 100 (${alert.riskLevel})
- Triggered Rules: ${alert.triggeredRules.join(", ")}

Format your response in crisp Markdown with:
1. Executive Risk Summary
2. Forensic Anomaly Breakdown (Why this pattern is suspicious in UPI/RTGS/SWIFT networks)
3. Regulatory & AML Impact (RBI / FATF / Banking compliance risk)
4. Recommended Immediate Action (Approve, Freeze, Escalated KYC, Block Beneficiary)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const reportText = response.text || "No report generated.";
    alert.aiExplanation = reportText;

    res.json({
      alertId,
      explanation: reportText
    });
  } catch (err: any) {
    console.error("Gemini Fraud AI Error:", err);
    res.status(500).json({
      error: "AI analysis service temporarily unavailable",
      details: err.message
    });
  }
});

// POST /api/ai/sql-query (NL to Analytics Assistant)
app.post("/api/ai/sql-query", async (req, res) => {
  const { userPrompt } = req.body;
  if (!userPrompt) return res.status(400).json({ error: "Prompt required" });

  const ai = getAiClient();
  if (!ai) {
    return res.json({
      sql: `SELECT merchant, SUM(amount) AS total_spend, COUNT(*) AS txn_count\nFROM transactions\nWHERE timestamp >= NOW() - INTERVAL '24 hours'\nGROUP BY merchant\nORDER BY total_spend DESC\nLIMIT 10;`,
      insights: `Simulated Analytics Engine Output: Executed query over 3.2M transactions. Top merchant by volume is Amazon India with ₹14.8M total throughput.`
    });
  }

  try {
    const prompt = `You are FinStream SQL & Analytics Data Engineering Engine.
The user wants to query the enterprise transaction data warehouse.
User prompt: "${userPrompt}"

PostgreSQL Database Schema available:
- transactions(id, timestamp, sender, receiver, amount, currency, merchant, category, location, payment_method, status, fraud_score, risk_level, ip_address, device_id)
- daily_summary(date, total_volume, total_revenue_inr, fraud_count, avg_ticket_size)
- fraud_alerts(id, transaction_id, customer_name, amount, risk_level, status, location)

Return a JSON object with:
1. "sql": The exact valid PostgreSQL query to solve this query.
2. "explanation": A brief 2-sentence explanation of what the query calculates and business insights.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics
app.get("/api/analytics", (_req, res) => {
  res.json({
    metrics: getPipelineMetrics(),
    hourlyRevenue: [
      { hour: "00:00", revenue: 2100000, volume: 8200 },
      { hour: "03:00", revenue: 1400000, volume: 4100 },
      { hour: "06:00", revenue: 4500000, volume: 15400 },
      { hour: "09:00", revenue: 12800000, volume: 48900 },
      { hour: "12:00", revenue: 19400000, volume: 78200 },
      { hour: "15:00", revenue: 22100000, volume: 89400 },
      { hour: "18:00", revenue: 16200000, volume: 64100 },
      { hour: "21:00", revenue: 9800000, volume: 38200 }
    ],
    channelDistribution: [
      { channel: "UPI", percentage: 48, value: 40560000 },
      { channel: "Credit Card", percentage: 22, value: 18590000 },
      { channel: "RTGS", percentage: 14, value: 11830000 },
      { channel: "NEFT", percentage: 8, value: 6760000 },
      { channel: "SWIFT", percentage: 5, value: 4220000 },
      { channel: "Internet Banking", percentage: 3, value: 2530000 }
    ],
    topMerchants: [
      { name: "Amazon India", count: 482910, totalVolume: "₹24.8M", fraudRatio: "0.02%" },
      { name: "Flipkart Internet", count: 391200, totalVolume: "₹19.4M", fraudRatio: "0.04%" },
      { name: "Swiggy / Zomato", count: 620100, totalVolume: "₹12.1M", fraudRatio: "0.01%" },
      { name: "MakeMyTrip Travel", count: 89200, totalVolume: "₹11.2M", fraudRatio: "0.15%" },
      { name: "CryptoGlobal Forex", count: 12400, totalVolume: "₹8.5M", fraudRatio: "4.20%" }
    ],
    countrySpend: [
      { country: "India", percentage: 82 },
      { country: "United States", percentage: 8 },
      { country: "United Kingdom", percentage: 5 },
      { country: "Singapore", percentage: 3 },
      { country: "Others", percentage: 2 }
    ]
  });
});

// GET /api/pipeline/health
app.get("/api/pipeline/health", (_req, res) => {
  res.json({
    metrics: getPipelineMetrics(),
    kafkaNodes: [
      { id: "kafka-broker-01", status: "HEALTHY", partitions: 32, lagMs: 4 },
      { id: "kafka-broker-02", status: "HEALTHY", partitions: 32, lagMs: 6 },
      { id: "kafka-broker-03", status: "HEALTHY", partitions: 32, lagMs: 3 }
    ],
    sparkJobs: [
      { name: "StreamValidationJob", status: "RUNNING", processedRecordsSec: 1850, uptime: "48d 12h" },
      { name: "FraudRuleEvaluatorStream", status: "RUNNING", processedRecordsSec: 2450, uptime: "48d 12h" },
      { name: "PostgresBatchAggregator", status: "RUNNING", processedRecordsSec: 920, uptime: "12d 04h" }
    ]
  });
});

// GET /api/audit-logs
app.get("/api/audit-logs", (_req, res) => {
  res.json({ logs: auditLogs });
});

// Mount Vite middleware for dev or static serving for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FinStream Enterprise Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
