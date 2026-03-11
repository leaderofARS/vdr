'use strict'
const axios = require('axios')
const chalk = require('chalk')
const { version } = require('../../package.json')

async function checkForUpdate() {
    try {
        const { data } = await axios.get('https://registry.npmjs.org/sipheron-vdr/latest', {
            timeout: 3000
        })
        const latest = data.version

        // Simple semver compare: version A > version B
        const isNewer = (v1, v2) => {
            const v1p = v1.split('.').map(Number);
            const v2p = v2.split('.').map(Number);
            for (let i = 0; i < 3; i++) {
                if (v1p[i] > v2p[i]) return true;
                if (v1p[i] < v2p[i]) return false;
            }
            return false;
        }

        if (latest && isNewer(latest, version)) {
            const line1 = ` Update available: ${version} → ${chalk.green(latest)}`;
            const line2 = ` Run: npm install -g sipheron-vdr`;

            console.log(
                '\n' + chalk.yellow('┌─────────────────────────────────────────────┐') +
                '\n' + chalk.yellow('│') + line1.padEnd(45 + (chalk.green(latest).length - latest.length)) + chalk.yellow('│') +
                '\n' + chalk.yellow('│') + line2.padEnd(45) + chalk.yellow('│') +
                '\n' + chalk.yellow('└─────────────────────────────────────────────┘') + '\n'
            )
        }
    } catch {
        // Silent fail — don't block CLI if npm is unreachable
    }
}

module.exports = { checkForUpdate }
