/**
 * @file test-permission-validator.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/cli/vdr-cli/src/utils/test-permission-validator.js
 * @description CLI utilities for encryption, formatting, and file management.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

#!/usr/bin/env node

/**
 * Manual test script for PermissionValidator
 * Run with: node cli/vdr-cli/src/utils/test-permission-validator.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const PermissionValidator = require('./permissionValidator');

console.log('=== PermissionValidator Manual Test ===\n');

const validator = new PermissionValidator();

// Create temporary test directory and file
const testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'perm-test-'));
const testFile = path.join(testDir, 'test-file.txt');
fs.writeFileSync(testFile, 'test content');

console.log(`Test directory: ${testDir}`);
console.log(`Test file: ${testFile}\n`);

// Test 1: Validate file with insecure permissions
console.log('Test 1: Validate file with insecure permissions (777)');
fs.chmodSync(testFile, 0o777);
let result = validator.validateFilePermissions(testFile);
console.log('Result:', JSON.stringify(result, null, 2));
console.log('Expected: isValid = false\n');

// Test 2: Enforce secure permissions on file
console.log('Test 2: Enforce secure permissions on file');
result = validator.enforceSecureAccess(testFile, { isDirectory: false });
console.log('Result:', JSON.stringify(result, null, 2));
console.log('Expected: success = true, appliedModeOctal = "600"\n');

// Test 3: Validate file with secure permissions
console.log('Test 3: Validate file with secure permissions (600)');
result = validator.validateFilePermissions(testFile);
console.log('Result:', JSON.stringify(result, null, 2));
console.log('Expected: isValid = true\n');

// Test 4: Validate directory with insecure permissions
console.log('Test 4: Validate directory with insecure permissions (777)');
fs.chmodSync(testDir, 0o777);
result = validator.validateDirectoryPermissions(testDir);
console.log('Result:', JSON.stringify(result, null, 2));
console.log('Expected: isValid = false\n');

// Test 5: Enforce secure permissions on directory
console.log('Test 5: Enforce secure permissions on directory');
result = validator.enforceSecureAccess(testDir, { isDirectory: true });
console.log('Result:', JSON.stringify(result, null, 2));
console.log('Expected: success = true, appliedModeOctal = "700"\n');

// Test 6: Validate directory with secure permissions
console.log('Test 6: Validate directory with secure permissions (700)');
result = validator.validateDirectoryPermissions(testDir);
console.log('Result:', JSON.stringify(result, null, 2));
console.log('Expected: isValid = true\n');

// Test 7: Test recursive enforcement
console.log('Test 7: Test recursive enforcement');
const subDir = path.join(testDir, 'subdir');
const subFile = path.join(subDir, 'subfile.txt');
fs.mkdirSync(subDir);
fs.writeFileSync(subFile, 'sub content');
fs.chmodSync(testDir, 0o777);
fs.chmodSync(subDir, 0o777);
fs.chmodSync(subFile, 0o777);

result = validator.enforceSecureAccess(testDir, { isDirectory: true, recursive: true });
console.log('Result (summary):', {
  success: result.success,
  allSuccess: result.allSuccess,
  appliedModeOctal: result.appliedModeOctal
});
console.log('Expected: success = true, allSuccess = true\n');

// Verify recursive changes
const dirStats = fs.statSync(testDir);
const subDirStats = fs.statSync(subDir);
const fileStats = fs.statSync(subFile);
console.log('Verification:');
console.log(`  testDir mode: ${(dirStats.mode & 0o777).toString(8)} (expected: 700)`);
console.log(`  subDir mode: ${(subDirStats.mode & 0o777).toString(8)} (expected: 700)`);
console.log(`  subFile mode: ${(fileStats.mode & 0o777).toString(8)} (expected: 600)`);

// Clean up
fs.unlinkSync(subFile);
fs.rmdirSync(subDir);
fs.unlinkSync(testFile);
fs.rmdirSync(testDir);

console.log('\n=== All tests completed ===');
console.log('Temporary files cleaned up.');
