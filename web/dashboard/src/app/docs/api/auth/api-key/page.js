import DocLayout from '../../../components/DocLayout';
import { Key, Shield, Info } from 'lucide-react';

const HEADINGS = [
    { id: 'api-key-overview', title: 'API Key Header Authentication', level: 2 },
    { id: 'usage', title: 'Header Format', level: 2 },
];

export default function ApiAuthKeyPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">API Auth: x-api-key</h1>
                <p className="text-xl text-gray-300 mb-12">Service-level authentication for the SipHeron API.</p>
                <div className="bg-black/60 border border-white/10 rounded-xl p-4 mb-8">
                    <code className="text-purple-300 font-mono text-sm leading-8">x-api-key: svdr_live_...</code>
                </div>
            </div>
        </DocLayout>
    );
}
