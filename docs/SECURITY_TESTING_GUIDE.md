# Security Testing Guide
## Verification of Pre-Release Security Fixes

This guide provides step-by-step instructions to verify all security fixes are working correctly.

---

## Prerequisites

```bash
# Install testing tools
npm install -g newman  # For API testing
npm install -g @lhci/cli  # For security header testing

# Or use curl and browser dev tools
```

---

## Test 1: Security Headers (Fix 1.8)

### Using curl
```bash
# Test security headers
curl -I http://localhost:3001/health

# Expected headers:
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Referrer-Policy: strict-origin-when-cross-origin
# Content-Security-Policy: default-src 'self'; ...
# Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()
```

### Using Browser
1. Open browser dev tools (F12)
2. Navigate to Network tab
3. Visit `http://localhost:3001/health`
4. Click on the request
5. Check Response Headers section
6. Verify all security headers are present

### Automated Test
```bash
# Create test script
cat > test-headers.sh << 'EOF'
#!/bin/bash
RESPONSE=$(curl -sI http://localhost:3001/health)

check_header() {
    if echo "$RESPONSE" | grep -qi "$1"; then
        echo "✓ $1 present"
    else
        echo "✗ $1 MISSING"
        exit 1
    fi
}

check_header "Strict-Transport-Security"
check_header "X-Content-Type-Options"
check_header "X-Frame-Options"
check_header "Content-Security-Policy"
echo "All security headers present!"
EOF

chmod +x test-headers.sh
./test-headers.sh
```

---

## Test 2: Input Sanitization (Fix 1.11)

### Test XSS Prevention
```bash
# Test 1: XSS in metadata
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "hash": "a".repeat(64),
    "metadata": "<script>alert(\"XSS\")</script>"
  }'

# Expected: Metadata should be HTML-encoded
# Response should contain: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;
```

### Test SQL Injection Prevention
```bash
# Test 2: SQL injection attempt
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "hash": "b".repeat(64),
    "metadata": "test\"; DROP TABLE users; --"
  }'

# Expected: Dangerous SQL keywords removed or escaped
```

### Test NoSQL Injection Prevention
```bash
# Test 3: NoSQL injection attempt
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "hash": "c".repeat(64),
    "metadata": "{\"$ne\": null}"
  }'

# Expected: NoSQL operators removed
```

### Test Hash Validation
```bash
# Test 4: Invalid hash format
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "hash": "invalid<script>",
    "metadata": "test"
  }'

# Expected: 400 Bad Request - Invalid SHA-256 hash
```

### Test Email Sanitization
```bash
# Test 5: Email injection
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com<script>alert(1)</script>",
    "password": "SecurePassword123!"
  }'

# Expected: 400 Bad Request - Invalid email format
```

---

## Test 3: HttpOnly Cookie Authentication (Fix 1.16)

### Test Cookie-Based Login
```bash
# Test 1: Login and receive cookie
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "your_password"
  }' \
  -c cookies.txt \
  -v

# Expected: Set-Cookie header with HttpOnly flag
# Look for: Set-Cookie: vdr_token=...; Path=/; HttpOnly; SameSite=Strict
```

### Test Cookie is HttpOnly
```bash
# Verify cookie attributes
cat cookies.txt | grep vdr_token

# Expected output should include:
# - HttpOnly flag
# - SameSite=Strict
# - Secure flag (in production)
```

### Test Authenticated Request with Cookie
```bash
# Test 2: Use cookie for authenticated request
curl http://localhost:3001/api/some-protected-route \
  -b cookies.txt

# Expected: 200 OK (authenticated)
```

### Test Logout Clears Cookie
```bash
# Test 3: Logout
curl -X POST http://localhost:3001/auth/logout \
  -b cookies.txt \
  -c cookies.txt

# Verify cookie is cleared
cat cookies.txt | grep vdr_token

# Expected: Cookie should be expired or removed
```

### Browser Test
1. Open browser dev tools (F12)
2. Go to Application/Storage tab
3. Login via the web interface
4. Check Cookies section
5. Verify `vdr_token` cookie has:
   - ✓ HttpOnly flag
   - ✓ Secure flag (production)
   - ✓ SameSite: Strict
6. Open Console tab
7. Try to access cookie: `document.cookie`
8. Expected: `vdr_token` should NOT be visible (HttpOnly protection)

---

## Test 4: Smart Contract TTL Enforcement (Fix 1.1 & 1.2)

### Test Expired Hash Verification
```bash
# 1. Register a hash with short expiry (e.g., 60 seconds from now)
EXPIRY=$(($(date +%s) + 60))

# Register hash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d "{
    \"hash\": \"$(echo -n 'test' | sha256sum | cut -d' ' -f1)\",
    \"metadata\": \"Test expiry\",
    \"expiry\": $EXPIRY
  }"

# 2. Verify immediately (should succeed)
curl -X POST http://localhost:3001/verify \
  -H "Content-Type: application/json" \
  -d "{
    \"hash\": \"$(echo -n 'test' | sha256sum | cut -d' ' -f1)\"
  }"

# Expected: Success

# 3. Wait 61 seconds
sleep 61

# 4. Verify again (should fail)
curl -X POST http://localhost:3001/verify \
  -H "Content-Type: application/json" \
  -d "{
    \"hash\": \"$(echo -n 'test' | sha256sum | cut -d' ' -f1)\"
  }"

# Expected: Error - "This hash has expired"
```

---

## Test 5: PDA Collision Prevention (Regression 3.2)

### Test Multiple Users Can Register Same Hash
```bash
# This test requires two different wallet keypairs

# User 1 registers hash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER1_TOKEN" \
  -d '{
    "hash": "d".repeat(64),
    "metadata": "User 1 data"
  }'

# User 2 registers same hash (should succeed with different PDA)
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER2_TOKEN" \
  -d '{
    "hash": "d".repeat(64),
    "metadata": "User 2 data"
  }'

# Expected: Both succeed, different PDAs created
# Verify on Solana Explorer that PDAs are different
```

---

## Test 6: CLI Token Storage Security (Fix 1.14)

### Test File Permissions
```bash
# Check config file permissions
ls -la ~/.vdr/config.json

# Expected: -rw------- (600) - owner read/write only

# Check directory permissions
ls -la ~/.vdr

# Expected: drwx------ (700) - owner access only
```

### Test Permission Enforcement
```bash
# Manually set insecure permissions
chmod 644 ~/.vdr/config.json

# Run CLI command
vdr-cli config show

# Expected: Warning about insecure permissions
# Expected: Automatic remediation to 600
```

---

## Test 7: Rate Limiting

### Test API Rate Limits
```bash
# Test general API rate limit (60 req/min)
for i in {1..65}; do
  curl -s http://localhost:3001/health > /dev/null
  echo "Request $i"
done

# Expected: Requests 61-65 should return 429 Too Many Requests
```

### Test Auth Rate Limits
```bash
# Test auth rate limit (50 req/min)
for i in {1..55}; do
  curl -s -X POST http://localhost:3001/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' > /dev/null
  echo "Auth attempt $i"
done

# Expected: Attempts 51-55 should return 429 Too Many Requests
```

---

## Test 8: Error Handling

### Test Error Information Disclosure
```bash
# Trigger an error
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'

# Expected in production:
# - Generic error message
# - NO stack traces
# - NO internal paths
# - NO database details
```

---

## Automated Test Suite

### Create Comprehensive Test Script
```bash
cat > test-security.sh << 'EOF'
#!/bin/bash

API_URL="http://localhost:3001"
PASSED=0
FAILED=0

test_case() {
    local name="$1"
    local command="$2"
    local expected="$3"
    
    echo -n "Testing: $name... "
    result=$(eval "$command" 2>&1)
    
    if echo "$result" | grep -q "$expected"; then
        echo "✓ PASSED"
        ((PASSED++))
    else
        echo "✗ FAILED"
        echo "  Expected: $expected"
        echo "  Got: $result"
        ((FAILED++))
    fi
}

echo "Running Security Test Suite..."
echo ""

# Test 1: Security Headers
test_case "Security Headers" \
    "curl -sI $API_URL/health" \
    "Strict-Transport-Security"

# Test 2: XSS Prevention
test_case "XSS Prevention" \
    "curl -s -X POST $API_URL/register -H 'Content-Type: application/json' -d '{\"hash\":\"$(printf 'a%.0s' {1..64})\",\"metadata\":\"<script>alert(1)</script>\"}'" \
    "&lt;script&gt;"

# Test 3: Invalid Hash Rejection
test_case "Invalid Hash Rejection" \
    "curl -s -X POST $API_URL/register -H 'Content-Type: application/json' -d '{\"hash\":\"invalid\",\"metadata\":\"test\"}'" \
    "Invalid"

# Test 4: Rate Limiting
test_case "Rate Limiting" \
    "for i in {1..65}; do curl -s $API_URL/health > /dev/null; done; curl -s $API_URL/health" \
    "Too many requests"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test Results: $PASSED passed, $FAILED failed"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAILED -eq 0 ]; then
    echo "✓ All tests passed!"
    exit 0
else
    echo "✗ Some tests failed"
    exit 1
fi
EOF

chmod +x test-security.sh
./test-security.sh
```

---

## Production Deployment Checklist

Before deploying to production:

- [ ] All tests pass in staging environment
- [ ] Security headers verified with SSL Labs
- [ ] Input sanitization tested with OWASP ZAP
- [ ] HttpOnly cookies working in all browsers
- [ ] Rate limiting tested under load
- [ ] Error handling doesn't leak information
- [ ] Key management migrated to KMS/encrypted storage
- [ ] Smart contract TTL enforcement verified on-chain
- [ ] PDA collision prevention verified on-chain
- [ ] CLI file permissions enforced
- [ ] Monitoring and alerting configured
- [ ] Incident response procedures documented

---

## Security Scanning Tools

### Recommended Tools
1. **OWASP ZAP** - Automated security scanner
2. **Burp Suite** - Manual penetration testing
3. **npm audit** - Dependency vulnerability scanning
4. **Snyk** - Continuous security monitoring
5. **SSL Labs** - SSL/TLS configuration testing

### Run Automated Scans
```bash
# Dependency vulnerabilities
npm audit

# Fix automatically
npm audit fix

# OWASP ZAP scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:3001
```

---

## Continuous Security

### Daily
- Monitor error logs for suspicious activity
- Review rate limit violations
- Check authentication failures

### Weekly
- Run automated security tests
- Review dependency updates
- Scan for new vulnerabilities

### Monthly
- Conduct manual penetration testing
- Review and update security policies
- Audit access logs

### Quarterly
- Third-party security audit
- Update security documentation
- Security training for team

---

## Support

For security issues or questions:
- Review: `SECURITY_AUDIT_FIXES_COMPLETE.md`
- Emergency: Follow incident response procedures
- Report: security@sipheron.com (if applicable)

---

**Remember:** Security is not a one-time fix, it's a continuous process.
