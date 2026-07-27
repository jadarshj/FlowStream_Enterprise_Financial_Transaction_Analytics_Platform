export type UserRole = "Admin" | "Analyst" | "Auditor" | "Data Engineer" | "Read-only User";

export interface Transaction {
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

export interface DLQRecord {
  id: string;
  timestamp: string;
  rawPayload: any;
  failureReason: string;
  errorCode: string;
  source: string;
  status: "UNRESOLVED" | "REDRIVEN" | "DISCARDED";
}

export interface FraudAlert {
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

export interface AuditLog {
  id: string;
  user: string;
  role: string;
  timestamp: string;
  action: string;
  ip: string;
  details: string;
}

export interface DataQualityStats {
  acceptedPct: number;
  duplicatePct: number;
  missingFieldsPct: number;
  invalidPct: number;
}

export interface PipelineMetrics {
  todayVolume: number;
  todayRevenueINR: number;
  fraudAlertsCount: number;
  failedTransactionsCount: number;
  processingLatencyMs: number;
  pipelineHealth: "HEALTHY" | "DEGRADED" | "CRITICAL";
  kafkaQueueSize: number;
  sparkThroughputTps: number;
  dbResponseTimeMs: number;
  redisCacheHitRate: number;
  dataQualityStats: DataQualityStats;
}

export interface HourlyRevenue {
  hour: string;
  revenue: number;
  volume: number;
}

export interface ChannelDistribution {
  channel: string;
  percentage: number;
  value: number;
}

export interface TopMerchant {
  name: string;
  count: number;
  totalVolume: string;
  fraudRatio: string;
}

export interface CountrySpend {
  country: string;
  percentage: number;
}
