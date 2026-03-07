const anchor = require('@coral-xyz/anchor');
const { Connection, PublicKey } = require('@solana/web3.js');
const idl = require('./src/services/vdr_contract.json');

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const programId = new PublicKey('6ecWPUK87zxwZP2pARJ75wbpCka92mYSGP1szrJxzAwo');

const [protocolConfigPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('protocol_config')],
    programId
);

console.log('Protocol Config PDA:', protocolConfigPda.toBase58());

connection.getAccountInfo(protocolConfigPda).then(info => {
    console.log('Account exists:', !!info);
    if (info) console.log('Data length:', info.data.length);
    else console.log('Protocol NOT initialized on chain!');
}).catch(e => console.error(e.message));
