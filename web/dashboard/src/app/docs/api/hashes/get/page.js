import DocLayout from '../../../components/DocLayout';

const HEADINGS = [
    { id: 'get-hash-details', title: 'Get Hash Details', level: 2 },
];

export default function ApiHashesGetPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">API: Get Hash</h1>
                <p className="text-gray-300 mb-8 font-mono">GET /api/hashes/:hash</p>
                <p className="text-gray-400">Retrieve on-chain confirmation details and current status for a specific document hash.</p>
            </div>
        </DocLayout>
    );
}
