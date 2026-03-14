export interface RecentAnchor {
  hash: string;
  status: string;
  createdAt: string;
  metadata?: string;
  organization?: {
    name: string;
  };
}

export interface PublicStats {
  totalHashes: number;
  confirmedHashes: number;
  confirmationRate: string;
  totalOrganizations: number;
  hashesThisMonth: number;
  hashesLastMonth: number;
  monthlyGrowth: string | null;
  recentAnchors: RecentAnchor[];
  contractAddress: string;
  network: string;
  avgConfirmationMs: number;
  uptime: string;
}

export interface TimeseriesPoint {
  date: string;
  count: number;
}

export interface DateRange {
  label: string;
  value: string;
  days: number;
}

export interface OrgAnalytics {
  period: string;
  summary: {
    totalRequests: number;
    successRate: string;
    avgResponseTime: number;
    mostUsedEndpoint: string;
    requestsToday: number;
    requestsThisWeek: number;
  };
  chartData: Array<{
    date: string;
    success: number;
    error: number;
  }>;
  apiKeys: Array<{
    id: string;
    key: string;
    name: string;
    total: number;
    count: number;
    successRate: string;
    lastUsed: string;
  }>;
  endpoints: Array<{
    endpoint: string;
    method: string;
    total: number;
    count: number;
    avgLatency: number;
  }>;
}

export interface TopDocument {
  hash: string;
  metadata: string;
  verificationCount: number;
  lastVerified: string;
}
