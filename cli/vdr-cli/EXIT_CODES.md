# SipHeron VDR CLI — Exit Codes

| Code | Meaning | Commands |
|------|---------|----------|
| 0 | Success / AUTHENTIC | All commands on success; verify when document is authentic |
| 1 | Failure / MISMATCH / NOT_FOUND | verify when mismatch or not found; any command on error |
| 2 | REVOKED | verify when document has been revoked |

## CI/CD Usage

Exit codes make sipheron-vdr composable with shell scripts and CI/CD pipelines:

```bash
# Fail the pipeline if document is not authentic
sipheron-vdr verify contract.pdf --format quiet || exit 1

# Fail if not confirmed after anchoring
sipheron-vdr status $HASH --format quiet || exit 1

# Use in GitHub Actions
- name: Verify build artifact
  run: sipheron-vdr verify dist/app.zip --format quiet

# Capture JSON output
RESULT=$(sipheron-vdr verify contract.pdf --format json)
AUTHENTIC=$(echo $RESULT | jq '.authentic')
```
