/**
 * @file permissionValidator.test.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/cli/vdr-cli/src/utils/permissionValidator.test.js
 * @description CLI utilities for encryption, formatting, and file management.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const PermissionValidator = require('./permissionValidator');

describe('PermissionValidator', () => {
  let validator;
  let testDir;
  let testFile;

  beforeEach(() => {
    validator = new PermissionValidator();
    
    // Create temporary test directory and file
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'perm-test-'));
    testFile = path.join(testDir, 'test-file.txt');
    fs.writeFileSync(testFile, 'test content');
  });

  afterEach(() => {
    // Clean up test files
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
    if (fs.existsSync(testDir)) {
      fs.rmdirSync(testDir, { recursive: true });
    }
  });

  describe('validateFilePermissions', () => {
    it('should validate file with secure permissions (600)', () => {
      fs.chmodSync(testFile, 0o600);
      const result = validator.validateFilePermissions(testFile);
      
      expect(result.isValid).toBe(true);
      expect(result.currentModeOctal).toBe('600');
      expect(result.expectedModeOctal).toBe('600');
    });

    it('should detect insecure file permissions', () => {
      fs.chmodSync(testFile, 0o777);
      const result = validator.validateFilePermissions(testFile);
      
      expect(result.isValid).toBe(false);
      expect(result.currentModeOctal).toBe('777');
      expect(result.expectedModeOctal).toBe('600');
    });

    it('should return error for non-existent file', () => {
      const result = validator.validateFilePermissions('/non/existent/file.txt');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('FILE_NOT_FOUND');
    });

    it('should allow readable permissions when specified', () => {
      fs.chmodSync(testFile, 0o644);
      const result = validator.validateFilePermissions(testFile, { 
        strict: false, 
        allowReadable: true 
      });
      
      expect(result.isValid).toBe(true);
      expect(result.currentModeOctal).toBe('644');
    });
  });

  describe('validateDirectoryPermissions', () => {
    it('should validate directory with secure permissions (700)', () => {
      fs.chmodSync(testDir, 0o700);
      const result = validator.validateDirectoryPermissions(testDir);
      
      expect(result.isValid).toBe(true);
      expect(result.currentModeOctal).toBe('700');
      expect(result.expectedModeOctal).toBe('700');
    });

    it('should detect insecure directory permissions', () => {
      fs.chmodSync(testDir, 0o777);
      const result = validator.validateDirectoryPermissions(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.currentModeOctal).toBe('777');
      expect(result.expectedModeOctal).toBe('700');
    });

    it('should return error for non-existent directory', () => {
      const result = validator.validateDirectoryPermissions('/non/existent/dir');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('DIRECTORY_NOT_FOUND');
    });

    it('should validate subdirectories recursively', () => {
      const subDir = path.join(testDir, 'subdir');
      fs.mkdirSync(subDir);
      fs.chmodSync(testDir, 0o700);
      fs.chmodSync(subDir, 0o700);
      
      const result = validator.validateDirectoryPermissions(testDir, { recursive: true });
      
      expect(result.isValid).toBe(true);
    });
  });

  describe('enforceSecureAccess', () => {
    it('should enforce secure permissions on file', () => {
      fs.chmodSync(testFile, 0o777);
      
      const result = validator.enforceSecureAccess(testFile, { isDirectory: false });
      
      expect(result.success).toBe(true);
      expect(result.appliedModeOctal).toBe('600');
      
      // Verify permissions were actually changed
      const stats = fs.statSync(testFile);
      const currentMode = stats.mode & 0o777;
      expect(currentMode).toBe(0o600);
    });

    it('should enforce secure permissions on directory', () => {
      fs.chmodSync(testDir, 0o777);
      
      const result = validator.enforceSecureAccess(testDir, { isDirectory: true });
      
      expect(result.success).toBe(true);
      expect(result.appliedModeOctal).toBe('700');
      
      // Verify permissions were actually changed
      const stats = fs.statSync(testDir);
      const currentMode = stats.mode & 0o777;
      expect(currentMode).toBe(0o700);
    });

    it('should return error for non-existent path', () => {
      const result = validator.enforceSecureAccess('/non/existent/path');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('PATH_NOT_FOUND');
    });

    it('should enforce permissions recursively', () => {
      const subDir = path.join(testDir, 'subdir');
      const subFile = path.join(subDir, 'file.txt');
      fs.mkdirSync(subDir);
      fs.writeFileSync(subFile, 'content');
      fs.chmodSync(testDir, 0o777);
      fs.chmodSync(subDir, 0o777);
      fs.chmodSync(subFile, 0o777);
      
      const result = validator.enforceSecureAccess(testDir, { 
        isDirectory: true, 
        recursive: true 
      });
      
      expect(result.success).toBe(true);
      expect(result.allSuccess).toBe(true);
      
      // Verify all permissions were changed
      const dirStats = fs.statSync(testDir);
      const subDirStats = fs.statSync(subDir);
      const fileStats = fs.statSync(subFile);
      
      expect(dirStats.mode & 0o777).toBe(0o700);
      expect(subDirStats.mode & 0o777).toBe(0o700);
      expect(fileStats.mode & 0o777).toBe(0o600);
    });
  });

  describe('_formatMode', () => {
    it('should format permission modes correctly', () => {
      expect(validator._formatMode(0o600)).toBe('rw-------');
      expect(validator._formatMode(0o700)).toBe('rwx------');
      expect(validator._formatMode(0o644)).toBe('rw-r--r--');
      expect(validator._formatMode(0o755)).toBe('rwxr-xr-x');
      expect(validator._formatMode(0o777)).toBe('rwxrwxrwx');
    });
  });
});
