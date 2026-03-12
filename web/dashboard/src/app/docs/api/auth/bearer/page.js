import DocLayout from '../../../components/DocLayout';
import { Lock, Key, Shield, Info } from 'lucide-react';

const HEADINGS = [
    { id: 'bearer-overview', title: 'Bearer Token Authentication', level: 2 },
    { id: 'usage', title: 'Header Format', level: 2 },
    { id: 'obtaining', title: 'How to Obtain', level: 2 },
];

export default function ApiAuthBearerPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">API Auth: Bearer Token</h1>
                <p className="text-xl text-gray-300 mb-12">User-level authentication for the SipHeron API.</p>
                <div className="bg-black/60 border border-white/10 rounded-xl p-4 mb-8">
                    <code className="text-purple-300 font-mono text-sm leading-8">Authorization: Bearer YOUR_JWT_HERE</code>
                </div>
            </div>
        </DocLayout>
    );
}
