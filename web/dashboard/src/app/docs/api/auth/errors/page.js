import DocLayout from '../../../components/DocLayout';

const HEADINGS = [
    { id: 'common-errors', title: 'Common API Errors', level: 2 },
];

export default function ApiAuthErrorsPage() {
    return (
        <DocLayout headings={HEADINGS}>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">API Auth Errors</h1>
                <p className="text-gray-300 mb-8">Detailed catalog of authentication-related error codes.</p>
                <ul className="space-y-4">
                  <li className="text-gray-400"><strong className="text-red-400">auth/invalid-key:</strong> The key format is correct but it is not in our database.</li>
                  <li className="text-gray-400"><strong className="text-red-400">auth/revoked-key:</strong> This key was manually revoked by an admin.</li>
                </ul>
            </div>
        </DocLayout>
    );
}
