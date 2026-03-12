export default function PendingBadge({ status }) {
    if (status === 'CONFIRMED' || status === 'active') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-500/10 border border-green-500/20 text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Confirmed
            </span>
        );
    }

    if (status === 'PENDING') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                Pending
            </span>
        );
    }

    if (status === 'FAILED') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-red-500/10 border border-red-500/20 text-red-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Failed
            </span>
        );
    }

    // fallback for revoked or unknown
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gray-500/10 border border-gray-500/20 text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            {status || 'Unknown'}
        </span>
    );
}
