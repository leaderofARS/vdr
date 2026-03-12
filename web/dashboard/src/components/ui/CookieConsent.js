'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Only show if no consent decision has been made yet
        try {
            const consent = localStorage.getItem('cookie_consent');
            if (!consent) setVisible(true);
        } catch (e) {
            // localStorage not available (SSR) — don't show
        }
    }, []);

    const handleAccept = () => {
        try { localStorage.setItem('cookie_consent', 'accepted'); } catch (e) {}
        setVisible(false);
    };

    const handleDecline = () => {
        try { localStorage.setItem('cookie_consent', 'declined'); } catch (e) {}
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto bg-[#111118] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                    <span className="text-lg">🍪</span>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">We use cookies</p>
                    <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                        We use essential cookies to keep you logged in. We do not use tracking or advertising cookies.{' '}
                        <a href="/legal/privacy" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
                            Privacy Policy
                        </a>
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                    <button
                        onClick={handleDecline}
                        className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
