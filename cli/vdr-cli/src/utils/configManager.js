const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_DIR = path.join(os.homedir(), '.vdr');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

function loadConfig() {
    if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR);
    if (!fs.existsSync(CONFIG_FILE)) {
        const defaultConfig = {
            apiUrl: 'http://localhost:3001',
            network: 'localnet',
            apiKey: null,
            defaultWallet: null
        };
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
        return defaultConfig;
    }
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
}

function saveConfig(config) {
    if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR);
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

function getWalletPath(name) {
    return path.join(CONFIG_DIR, `wallet_${name}.json`);
}

module.exports = {
    loadConfig,
    saveConfig,
    getWalletPath,
    CONFIG_DIR
};
