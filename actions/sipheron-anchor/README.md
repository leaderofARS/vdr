# SipHeron VDR GitHub Action

The official GitHub Action for the SipHeron Verifiable Data Registry (VDR).

This action allows open-source and enterprise developers to cryptographically hash their compiled release binaries automatically during their CI/CD pipeline, and permanently anchor those hashes into the Solana blockchain.

This is critical for preventing **Supply Chain Attacks**. When users download your release, they can use the `sipheron-vdr verify` command to ensure the binary they downloaded identically matches the hash you anchored during the build process.

## Usage

Add this action to your `.github/workflows/release.yml` file after your build steps.

```yaml
name: Build and Secure Release

on:
  release:
    types: [published]

jobs:
  build_and_anchor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # 1. Build your project
      - name: Build Application
        run: npm run build # (Your build output directory should now exist, e.g., ./dist)
      
      # 2. Anchor the binaries
      - name: Anchor to SipHeron VDR
        uses: sipheron/vdr-action@v1
        with:
          # The directory containing your compiled binaries
          directory: './dist'
          
          # Your SipHeron API Key (Must be stored in GitHub Secrets)
          api_key: ${{ secrets.SIPHERON_API_KEY }}
          
          # The SipHeron Network (devnet or mainnet)
          network: 'mainnet'
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `directory` | The folder containing the files you want to anchor. The action will recursively hash every file inside this folder. | **Yes** | `./dist` |
| `api_key` | Your SipHeron API Key. Generate this from your SipHeron Dashboard and save it as a GitHub Secret. | **Yes** | N/A |
| `network` | The Solana network environment (`localnet`, `devnet`, or `mainnet`). | No | `devnet` |
| `api_url` | The URL of the SipHeron Backend Node. Change this if you are self-hosting your own SipHeron registry. | No | `https://api.sipheron.com` |

## Security Note

This action operates using a Zero-Knowledge architecture. At no point does the Action upload your actual binaries or source code to the SipHeron servers. 

The installed `sipheron-vdr stage` CLI calculates the SHA-256 hashes *locally* on the ephemeral GitHub runner. Only the 32-byte cryptographic hashes and filenames are transmitted to the backend for transaction building.
