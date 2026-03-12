import DocLayout from '../../../components/DocLayout';

const HEADINGS = [
    { id: 'revoke-hash', title: 'Revoke Hash', level: 2 },
];

export default function ApiHashesRevokePage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">API: Revoke Hash</h1>
                <p className="text-gray-300 mb-8 font-mono">POST /api/hashes/revoke</p>
                <p className="text-gray-400">Permanently invalidate a previously anchored document on the blockchain.</p>
            </div>
        </DocLayout>
    );
}
