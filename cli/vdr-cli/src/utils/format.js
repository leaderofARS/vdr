/**
 * Format a Solana transaction signature into a short string
 * @param {string} tx 
 * @returns {string} format
 */
function formatTx(tx) {
    if (!tx || tx.length < 16) return tx;
    return `${tx.substring(0, 8)}...${tx.substring(tx.length - 8)}`;
}

module.exports = { formatTx };
