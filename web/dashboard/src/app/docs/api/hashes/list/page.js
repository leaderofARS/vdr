import DocLayout from '../../../components/DocLayout';

const HEADINGS = [
    { id: 'list-hashes', title: 'List Hashes', level: 2 },
];

export default function ApiHashesListPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">API: List Hashes</h1>
                <p className="text-gray-300 mb-8 font-mono">GET /api/hashes</p>
                <p className="text-gray-400">Search and filter through your organization's anchored document history.</p>
            </div>
        </DocLayout>
    );
}
