"use client";

/**
 * @file WalletContextProvider.jsx
 * @module /home/ars0x01/Documents/Github/solana-vdr/web/dashboard/src/components/WalletContextProvider.jsx
 * @description Reusable React UI components.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */


import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

export function WalletContextProvider({ children }) {
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // By passing an empty array, we rely on the Wallet Standard to automatically
    // detect and register all browser-extension wallets (Phantom, Solflare, etc.).
    // This prevents duplicate key errors when extensions are detected twice.
    const wallets = useMemo(() => [], []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
