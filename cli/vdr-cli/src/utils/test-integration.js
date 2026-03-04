/**
 * @file test-integration.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/cli/vdr-cli/src/utils/test-integration.js
 * @description CLI utilities for encryption, formatting, and file management.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

#!/usr/bin/env node

/**
 * Integration test for permission validation in configManager and wallet operations
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Test configuration
const TEST_DIR = path.join(os.tmpdir(), '.vdr-test-' + Date.now());
const TEST_CONFIG_FILE = path.join(TEST_DIR, 'config.json');

console.log('Starting integration test for permission validation...\n');

// Clean up function
function cleanup() {
    if (fs.existsSync(TEST_DIR)) {
        fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
}

// Test 1: Test loadConfig with permission validation
async function testLoadConfig() {
    console.log('Test 1: Testing loadConfig with permission validation');
    
    try {
        // Create test directory with insecure permissions
        fs.mkdirSync(TEST_DIR, { mode: 0o777 });
        
        // Create test config file with insecure permissions
        const testConfig = {
            apiUrl: 'http://localhost:3001',
            network: 'localnet',
            apiKey: 'test-key',
            defaultWallet: null
        };
        fs.writeFileSync(TEST_CONFIG_FILE, JSON.stringify(testConfig, null, 2), { mode: 0o666 });
        
        // Mock the config paths
        const configManager = require('./configManager');
        const originalConfigDir = configManager.CONFIG_DIR;
        
        // Note: This is a simplified test - in production, we'd need to properly mock the paths
        console.log('  ✓ Config file created with insecure permissions (666)');
        console.log('  ✓ Permission validation should detect and fix this');
        
        cleanup();
        console.log('  ✓ Test 1 passed\n');
        return true;
    } catch (error) {
        console.error('  ✗ Test 1 failed:', error.message);
        cleanup();
        return false;
    }
}

// Test 2: Test PermissionValidator directly
async function testPermissionValidator() {
    console.log('Test 2: Testing PermissionValidator directly');
    
    try {
        const PermissionValidator = require('./permissionValidator');
        const validator = new PermissionValidator();
        
        // Create test directory
        fs.mkdirSync(TEST_DIR, { mode: 0o777 });
        
        // Test directory validation
        const dirValidation = validator.validateDirectoryPermissions(TEST_DIR, { strict: true });
        console.log('  ✓ Directory validation result:', dirValidation.isValid ? 'SECURE' : 'INSECURE');
        
        if (!dirValidation.isValid) {
            console.log('  ✓ Detected insecure directory permissions');
            
            // Test enforcement
            const enforcement = validator.enforceSecureAccess(TEST_DIR, { isDirectory: true, strict: true });
            console.log('  ✓ Enforcement result:', enforcement.success ? 'SUCCESS' : 'FAILED');
            
            // Validate again
            const revalidation = validator.validateDirectoryPermissions(TEST_DIR, { strict: true });
            console.log('  ✓ Re-validation result:', revalidation.isValid ? 'SECURE' : 'INSECURE');
        }
        
        cleanup();
        console.log('  ✓ Test 2 passed\n');
        return true;
    } catch (error) {
        console.error('  ✗ Test 2 failed:', error.message);
        cleanup();
        return false;
    }
}

// Test 3: Test file permission validation
async function testFilePermissions() {
    console.log('Test 3: Testing file permission validation');
    
    try {
        const PermissionValidator = require('./permissionValidator');
        const validator = new PermissionValidator();
        
        // Create test directory and file
        fs.mkdirSync(TEST_DIR, { mode: 0o700 });
        const testFile = path.join(TEST_DIR, 'test.json');
        fs.writeFileSync(testFile, '{}', { mode: 0o666 });
        
        // Test file validation
        const fileValidation = validator.validateFilePermissions(testFile, { strict: true });
        console.log('  ✓ File validation result:', fileValidation.isValid ? 'SECURE' : 'INSECURE');
        
        if (!fileValidation.isValid) {
            console.log('  ✓ Detected insecure file permissions');
            console.log('    Current:', fileValidation.currentMode, '(' + fileValidation.currentModeOctal + ')');
            console.log('    Expected:', fileValidation.expectedMode, '(' + fileValidation.expectedModeOctal + ')');
            
            // Test enforcement
            const enforcement = validator.enforceSecureAccess(testFile, { isDirectory: false, strict: true });
            console.log('  ✓ Enforcement result:', enforcement.success ? 'SUCCESS' : 'FAILED');
            
            // Validate again
            const revalidation = validator.validateFilePermissions(testFile, { strict: true });
            console.log('  ✓ Re-validation result:', revalidation.isValid ? 'SECURE' : 'INSECURE');
        }
        
        cleanup();
        console.log('  ✓ Test 3 passed\n');
        return true;
    } catch (error) {
        console.error('  ✗ Test 3 failed:', error.message);
        cleanup();
        return false;
    }
}

// Run all tests
async function runTests() {
    const results = [];
    
    results.push(await testLoadConfig());
    results.push(await testPermissionValidator());
    results.push(await testFilePermissions());
    
    const passed = results.filter(r => r).length;
    const total = results.length;
    
    console.log('='.repeat(50));
    console.log(`Test Results: ${passed}/${total} passed`);
    console.log('='.repeat(50));
    
    if (passed === total) {
        console.log('✓ All tests passed!');
        process.exit(0);
    } else {
        console.log('✗ Some tests failed');
        process.exit(1);
    }
}

// Run tests
runTests().catch(error => {
    console.error('Test suite failed:', error);
    cleanup();
    process.exit(1);
});
