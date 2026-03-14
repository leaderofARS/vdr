export interface PublicStats {
  totalHashes: number
  confirmedHashes: number
  confirmationRate: string
  totalOrganizations: number
  hashesThisMonth: number
  hashesLastMonth: number
  monthlyGrowth: string | null
  recentAnchors: RecentAnchor[]
  contractAddress: string
  network: string
  avgConfirmationMs: number
  uptime: string
}

export interface TimeseriesPoint {
  date: string
  count: number
}

export interface RecentAnchor {
  hash: string
  status: string
  createdAt: string
  metadata?: string
}

export interface OrgAnalytics {
  totalHashes: number
  confirmedHashes: number
  pendingHashes: number
  failedHashes: number
  revokedHashes: number
  hashesThisPeriod: number
  hashesLastPeriod: number
  avgPerDay: number
  confirmationRate: number
  timeseries: TimeseriesPoint[]
  topDocuments: TopDocument[]
}

export interface TopDocument {
  hash: string
  metadata?: string
  verificationCount: number
  status: string
}
