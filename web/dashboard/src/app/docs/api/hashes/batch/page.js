import DocLayout from '../../../components/DocLayout';

const HEADINGS = [
    { id: 'batch-register', title: 'Batch Register', level: 2 },
];

export default function ApiHashesBatchPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">API: Batch Register</h1>
                <p className="text-gray-300 mb-8 font-mono">POST /api/hashes/batch</p>
                <p className="text-gray-400">Anchor multiple document hashes in a single Solana transaction for maximum cost efficiency.</p>
            </div>
        </DocLayout>
    );
}
