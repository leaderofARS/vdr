'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '@/utils/api';

/**
 * Polls /api/hashes/pending every 5 seconds when there are pending hashes.
 * Stops polling automatically when all hashes are confirmed.
 * Calls onConfirmed(hash) when a hash transitions from PENDING to CONFIRMED.
 */
export function usePendingHashes({ onConfirmed, onRefresh } = {}) {
    const [pendingIds, setPendingIds] = useState(new Set());
    const [isPolling, setIsPolling] = useState(false);
    const intervalRef = useRef(null);
    const prevPendingRef = useRef(new Set());

    const checkPending = useCallback(async () => {
        try {
            const res = await api.get('/api/hashes/pending');
            const currentPending = new Set(res.data.pending.map(h => h.id));

            // Detect transitions — hashes that were pending but are no longer
            const confirmed = [...prevPendingRef.current].filter(id => !currentPending.has(id));
            if (confirmed.length > 0) {
                confirmed.forEach(id => onConfirmed?.(id));
                onRefresh?.(); // trigger full hashes list refresh
            }

            prevPendingRef.current = currentPending;
            setPendingIds(currentPending);

            // Auto-stop polling when nothing is pending
            if (currentPending.size === 0) {
                stopPolling();
            }
        } catch (err) {
            console.error('[POLLING] Failed to check pending hashes:', err.message);
        }
    }, [onConfirmed, onRefresh]);

    const startPolling = useCallback(() => {
        if (intervalRef.current) return; // already polling
        setIsPolling(true);
        checkPending(); // immediate first check
        intervalRef.current = setInterval(checkPending, 5000);
    }, [checkPending]);

    const stopPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsPolling(false);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => stopPolling();
    }, [stopPolling]);

    return { pendingIds, isPolling, startPolling, stopPolling };
}
