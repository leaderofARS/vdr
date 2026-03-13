import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Copy,
  ExternalLink,
  MoreHorizontal,
  Eye,
  Download,
  Ban,
  CheckSquare,
  X,
} from 'lucide-react';
import { StatusBadge } from '@/components/shared';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Hash {
  id: number;
  name: string;
  hash: string;
  status: 'CONFIRMED' | 'PENDING' | 'FAILED' | 'REVOKED';
  user: string;
  date: string;
  tx: string;
}

const mockHashes: Hash[] = [
  { id: 1, name: 'contract.pdf', hash: 'a3f4b2c1d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4', status: 'CONFIRMED', user: 'John Doe', date: '2 min ago', tx: '3xK9mPqRsTuVwXyZ123456789' },
  { id: 2, name: 'invoice_q4.pdf', hash: 'd8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8', status: 'CONFIRMED', user: 'Sarah Kim', date: '15 min ago', tx: '5yL0nQqRtUvWxYz234567890' },
  { id: 3, name: 'nda_template.docx', hash: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', status: 'PENDING', user: 'Mike Chen', date: '32 min ago', tx: '7zP2rStUvWxYzAb345678901' },
  { id: 4, name: 'audit_report.pdf', hash: 'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', status: 'CONFIRMED', user: 'John Doe', date: '1 hour ago', tx: '9xT4vUwXyZaBcDe456789012' },
  { id: 5, name: 'compliance_check.pdf', hash: 'd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0', status: 'CONFIRMED', user: 'Lisa Wang', date: '2 hours ago', tx: '1wR6yZzAbBcDeEf567890123' },
  { id: 6, name: 'old_contract.pdf', hash: 'e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1', status: 'REVOKED', user: 'John Doe', date: '1 day ago', tx: '2xS7zAaBbCcDdEe678901234' },
  { id: 7, name: 'failed_upload.pdf', hash: 'a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2', status: 'FAILED', user: 'Tom Brown', date: '2 days ago', tx: '' },
];

const statusCounts = {
  total: mockHashes.length,
  confirmed: mockHashes.filter((h) => h.status === 'CONFIRMED').length,
  pending: mockHashes.filter((h) => h.status === 'PENDING').length,
  revoked: mockHashes.filter((h) => h.status === 'REVOKED').length,
};

export const HashesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHashes, setSelectedHashes] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredHashes = mockHashes.filter((hash) => {
    const matchesSearch =
      hash.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hash.hash.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || hash.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelection = (id: number) => {
    setSelectedHashes((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedHashes.length === filteredHashes.length) {
      setSelectedHashes([]);
    } else {
      setSelectedHashes(filteredHashes.map((h) => h.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-sipheron-text-primary">Hashes</h2>
          <p className="text-sm text-sipheron-text-muted mt-1">
            Manage and verify your anchored document hashes
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2 self-start">
          <Plus className="w-4 h-4" />
          Anchor New
        </button>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: statusCounts.total, color: 'text-sipheron-text-primary' },
          { label: 'Confirmed', value: statusCounts.confirmed, color: 'text-sipheron-green' },
          { label: 'Pending', value: statusCounts.pending, color: 'text-sipheron-gold' },
          { label: 'Revoked', value: statusCounts.revoked, color: 'text-sipheron-orange' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-sipheron-surface rounded-xl p-4 border border-white/[0.06]"
          >
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-sipheron-text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sipheron-text-muted" />
          <input
            type="text"
            placeholder="Search by name or hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-sipheron-surface border border-white/[0.06] text-sipheron-text-primary placeholder:text-sipheron-text-muted focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-sipheron-surface border border-white/[0.06] text-sipheron-text-primary focus:border-sipheron-purple focus:ring-2 focus:ring-sipheron-purple/20 transition-all"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="revoked">Revoked</option>
          </select>
          <button className="px-4 py-2 rounded-lg bg-sipheron-surface border border-white/[0.06] text-sipheron-text-secondary hover:bg-white/[0.03] transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-sipheron-surface rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-4 py-3 w-10">
                  <button
                    onClick={selectAll}
                    className="flex items-center justify-center"
                  >
                    {selectedHashes.length === filteredHashes.length && filteredHashes.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-sipheron-purple" />
                    ) : (
                      <div className="w-4 h-4 rounded border border-sipheron-text-muted" />
                    )}
                  </button>
                </th>
                <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                  #
                </th>
                <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                  Document Name
                </th>
                <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                  Hash
                </th>
                <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                  Anchored By
                </th>
                <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                  Date
                </th>
                <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                  Tx Link
                </th>
                <th className="text-right text-xs text-sipheron-text-muted font-medium px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHashes.map((hash, index) => (
                <tr
                  key={hash.id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleSelection(hash.id)}
                      className="flex items-center justify-center"
                    >
                      {selectedHashes.includes(hash.id) ? (
                        <CheckSquare className="w-4 h-4 text-sipheron-purple" />
                      ) : (
                        <div className="w-4 h-4 rounded border border-sipheron-text-muted" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-sipheron-text-muted">{index + 1}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-sipheron-text-primary">{hash.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-sipheron-teal">
                        {hash.hash.slice(0, 8)}...{hash.hash.slice(-8)}
                      </code>
                      <button className="text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={hash.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-sipheron-text-secondary">{hash.user}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-sipheron-text-muted">{hash.date}</span>
                  </td>
                  <td className="px-4 py-3">
                    {hash.tx ? (
                      <a
                        href={`https://explorer.solana.com/tx/${hash.tx}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sipheron-purple hover:text-sipheron-teal transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <span className="text-sipheron-text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors ml-auto">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-sipheron-surface border-white/[0.06]"
                      >
                        <DropdownMenuItem className="cursor-pointer focus:bg-white/[0.03]">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer focus:bg-white/[0.03]">
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer focus:bg-white/[0.03]">
                          <Download className="w-4 h-4 mr-2" />
                          Download Certificate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/[0.06]" />
                        <DropdownMenuItem className="cursor-pointer text-sipheron-red focus:bg-white/[0.03]">
                          <Ban className="w-4 h-4 mr-2" />
                          Revoke
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredHashes.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sipheron-purple/10 flex items-center justify-center">
              <Search className="w-8 h-8 text-sipheron-purple" />
            </div>
            <h3 className="text-lg font-medium text-sipheron-text-primary mb-2">
              No hashes found
            </h3>
            <p className="text-sm text-sipheron-text-muted mb-4">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
          <span className="text-xs text-sipheron-text-muted">
            Showing {filteredHashes.length} of {mockHashes.length} results
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-white/[0.03] text-sipheron-text-muted text-xs hover:bg-white/[0.05] transition-colors disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-white/[0.03] text-sipheron-text-muted text-xs hover:bg-white/[0.05] transition-colors disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedHashes.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-xl bg-sipheron-surface border border-sipheron-purple/30 shadow-lg shadow-sipheron-purple/10 animate-slide-up">
          <span className="text-sm text-sipheron-text-primary">
            {selectedHashes.length} selected
          </span>
          <div className="h-4 w-px bg-white/[0.1]" />
          <button className="text-sm text-sipheron-red hover:text-sipheron-red/80 transition-colors">
            Revoke
          </button>
          <button className="text-sm text-sipheron-text-secondary hover:text-sipheron-text-primary transition-colors">
            Export
          </button>
          <button className="text-sm text-sipheron-text-secondary hover:text-sipheron-text-primary transition-colors">
            Download Certificates
          </button>
          <button
            onClick={() => setSelectedHashes([])}
            className="p-1 rounded hover:bg-white/[0.05] text-sipheron-text-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default HashesPage;
