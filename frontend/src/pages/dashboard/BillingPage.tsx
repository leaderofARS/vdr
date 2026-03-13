import React from 'react';
import { Check, CreditCard, Download, ArrowRight, Sparkles } from 'lucide-react';

const currentPlan = {
  name: 'Free',
  price: 0,
  anchorsLimit: 100,
  anchorsUsed: 27,
  usersLimit: 1,
  usersUsed: 1,
};

const invoices = [
  { id: 'INV-001', date: 'Jan 1, 2025', amount: 0, status: 'Paid' },
  { id: 'INV-002', date: 'Dec 1, 2024', amount: 0, status: 'Paid' },
  { id: 'INV-003', date: 'Nov 1, 2024', amount: 0, status: 'Paid' },
];

export const BillingPage: React.FC = () => {
  const anchorsPercentage = (currentPlan.anchorsUsed / currentPlan.anchorsLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-sipheron-text-primary">Billing</h2>
        <p className="text-sm text-sipheron-text-muted mt-1">
          Manage your subscription and payment methods
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-sipheron-text-primary">
                {currentPlan.name} Plan
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-sipheron-green/10 text-sipheron-green border border-sipheron-green/20">
                Current
              </span>
            </div>
            <p className="text-sm text-sipheron-text-muted">
              ${currentPlan.price}/month · Renewed monthly
            </p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-sipheron-purple/10 text-sipheron-purple text-sm hover:bg-sipheron-purple/20 transition-colors">
            Change Plan
          </button>
        </div>

        {/* Usage Meters */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-sipheron-text-secondary">Anchors</span>
              <span className="text-sipheron-text-primary">
                {currentPlan.anchorsUsed} / {currentPlan.anchorsLimit}
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sipheron-purple to-sipheron-teal transition-all"
                style={{ width: `${anchorsPercentage}%` }}
              />
            </div>
            <p className="text-xs text-sipheron-text-muted mt-1">
              {currentPlan.anchorsLimit - currentPlan.anchorsUsed} anchors remaining this month
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-sipheron-text-secondary">Team Members</span>
              <span className="text-sipheron-text-primary">
                {currentPlan.usersUsed} / {currentPlan.usersLimit}
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
              <div
                className="h-full rounded-full bg-sipheron-teal transition-all"
                style={{ width: `${(currentPlan.usersUsed / currentPlan.usersLimit) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="relative overflow-hidden rounded-2xl p-6 border border-sipheron-purple/30 bg-gradient-to-br from-sipheron-purple/10 to-transparent">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-sipheron-purple" />
              <h3 className="text-lg font-semibold text-sipheron-text-primary">
                Upgrade to Business
              </h3>
            </div>
            <p className="text-sm text-sipheron-text-secondary">
              Get 10,000 anchors/month, 10 team members, white-label certificates, and more.
            </p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            Start 14-day Trial
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        {/* Decorative gradient */}
        <div
          className="absolute top-0 right-0 w-64 h-64 opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(108,99,255,0.4) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Payment Method */}
      <div className="bg-sipheron-surface rounded-2xl p-6 border border-white/[0.06]">
        <h3 className="text-sm font-semibold text-sipheron-text-primary mb-4">
          Payment Method
        </h3>
        <div className="flex items-center justify-between p-4 rounded-lg bg-sipheron-base border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-sipheron-text-muted" />
            </div>
            <div>
              <div className="text-sm text-sipheron-text-primary">No payment method</div>
              <div className="text-xs text-sipheron-text-muted">
                Add a card to upgrade your plan
              </div>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-white/[0.05] text-sipheron-text-secondary text-sm hover:bg-white/[0.1] transition-colors">
            Add Card
          </button>
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-sipheron-surface rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="p-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-sipheron-text-primary">
            Invoice History
          </h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                Invoice
              </th>
              <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                Date
              </th>
              <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                Amount
              </th>
              <th className="text-left text-xs text-sipheron-text-muted font-medium px-4 py-3">
                Status
              </th>
              <th className="text-right text-xs text-sipheron-text-muted font-medium px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-white/[0.04]">
                <td className="px-4 py-3">
                  <span className="text-sm text-sipheron-text-primary">{invoice.id}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-sipheron-text-secondary">{invoice.date}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-sipheron-text-primary">${invoice.amount}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-sipheron-green/10 text-sipheron-green border border-sipheron-green/20">
                    <Check className="w-3 h-3" />
                    {invoice.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="p-1.5 rounded hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingPage;
