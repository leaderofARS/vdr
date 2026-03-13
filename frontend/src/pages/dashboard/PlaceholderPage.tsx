import React from 'react';
import { Construction } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/dashboard/bulk-verify': 'Bulk Verify',
  '/dashboard/webhooks': 'Webhooks',
  '/dashboard/audit': 'Audit Log',
  '/dashboard/playground': 'Playground',
  '/dashboard/embed': 'Embed & Share',
  '/dashboard/usage': 'Usage',
  '/dashboard/notifications': 'Notifications',
};

interface PlaceholderPageProps {
  title?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title: propTitle }) => {
  const location = useLocation();
  const title = propTitle || pageTitles[location.pathname] || 'Page';

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-16 h-16 rounded-2xl bg-sipheron-purple/10 flex items-center justify-center mb-4">
        <Construction className="w-8 h-8 text-sipheron-purple" />
      </div>
      <h2 className="text-xl font-semibold text-sipheron-text-primary mb-2">
        {title}
      </h2>
      <p className="text-sm text-sipheron-text-muted text-center max-w-md">
        This page is under development. Check back soon for updates.
      </p>
    </div>
  );
};

export default PlaceholderPage;
