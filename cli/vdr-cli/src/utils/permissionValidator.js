/**
 * @file permissionValidator.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/cli/vdr-cli/src/utils/permissionValidator.js
 * @description CLI utilities for encryption, formatting, and file management.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

const fs = require('fs');
const path = require('path');

// Silent on Windows — skip ALL permission checks
if (process.platform === 'win32') {
  module.exports = class PermissionValidator {
    validateFilePermissions() { return { isValid: true }; }
    validateDirectoryPermissions() { return { isValid: true }; }
    enforceSecureAccess() { return { success: true }; }
  };
  return;
}

/**
 * PermissionValidator class for validating and enforcing secure file and directory permissions
 */
class PermissionValidator {
  constructor() {
    // Secure permission modes (octal)
    this.SECURE_FILE_MODE = 0o600; // rw------- (owner read/write only)
    this.SECURE_DIR_MODE = 0o700;  // rwx------ (owner read/write/execute only)
    this.READABLE_FILE_MODE = 0o644; // rw-r--r-- (owner read/write, others read)
    this.READABLE_DIR_MODE = 0o755;  // rwxr-xr-x (owner full, others read/execute)

    // Platform detection
    const os = require('os');
    this.isWindows = os.platform() === 'win32';
  }


  /**
   * Validate file permissions against secure standards
   * @param {string} filePath - Path to the file to validate
   * @param {object} options - Validation options
   * @param {boolean} options.strict - If true, requires most restrictive permissions (600)
   * @param {boolean} options.allowReadable - If true, allows readable permissions (644)
   * @returns {object} Validation result with isValid, currentMode, expectedMode, and message
   */
  validateFilePermissions(filePath, options = {}) {
    const { strict = true, allowReadable = false } = options;

    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return {
          isValid: false,
          error: 'FILE_NOT_FOUND',
          message: `File does not exist: ${filePath}`
        };
      }

      // Get file stats
      const stats = fs.statSync(filePath);

      // Ensure it's a file
      if (!stats.isFile()) {
        return {
          isValid: false,
          error: 'NOT_A_FILE',
          message: `Path is not a file: ${filePath}`
        };
      }

      // Get current permissions (last 3 octal digits)
      const currentMode = stats.mode & 0o777;

      // Determine expected mode based on options
      const expectedMode = strict || !allowReadable
        ? this.SECURE_FILE_MODE
        : this.READABLE_FILE_MODE;

      // Check if permissions match expected
      const isValid = currentMode === expectedMode;

      return {
        isValid,
        currentMode: this._formatMode(currentMode),
        expectedMode: this._formatMode(expectedMode),
        currentModeOctal: currentMode.toString(8),
        expectedModeOctal: expectedMode.toString(8),
        filePath,
        message: isValid
          ? `File permissions are secure: ${filePath}`
          : `Insecure file permissions detected. Current: ${this._formatMode(currentMode)}, Expected: ${this._formatMode(expectedMode)}`
      };
    } catch (error) {
      return {
        isValid: false,
        error: 'VALIDATION_ERROR',
        message: `Error validating file permissions: ${error.message}`,
        filePath
      };
    }
  }

  /**
   * Validate directory permissions against secure standards
   * @param {string} dirPath - Path to the directory to validate
   * @param {object} options - Validation options
   * @param {boolean} options.strict - If true, requires most restrictive permissions (700)
   * @param {boolean} options.allowReadable - If true, allows readable permissions (755)
   * @param {boolean} options.recursive - If true, validates all subdirectories
   * @returns {object} Validation result
   */
  validateDirectoryPermissions(dirPath, options = {}) {
    const { strict = true, allowReadable = false, recursive = false } = options;

    try {
      // Check if directory exists
      if (!fs.existsSync(dirPath)) {
        return {
          isValid: false,
          error: 'DIRECTORY_NOT_FOUND',
          message: `Directory does not exist: ${dirPath}`
        };
      }

      // Get directory stats
      const stats = fs.statSync(dirPath);

      // Ensure it's a directory
      if (!stats.isDirectory()) {
        return {
          isValid: false,
          error: 'NOT_A_DIRECTORY',
          message: `Path is not a directory: ${dirPath}`
        };
      }

      // Get current permissions
      const currentMode = stats.mode & 0o777;

      // Determine expected mode
      const expectedMode = strict || !allowReadable
        ? this.SECURE_DIR_MODE
        : this.READABLE_DIR_MODE;

      // Check if permissions match expected
      const isValid = currentMode === expectedMode;

      const result = {
        isValid,
        currentMode: this._formatMode(currentMode),
        expectedMode: this._formatMode(expectedMode),
        currentModeOctal: currentMode.toString(8),
        expectedModeOctal: expectedMode.toString(8),
        dirPath,
        message: isValid
          ? `Directory permissions are secure: ${dirPath}`
          : `Insecure directory permissions detected. Current: ${this._formatMode(currentMode)}, Expected: ${this._formatMode(expectedMode)}`
      };

      // Recursive validation if requested
      if (recursive && isValid) {
        const subdirs = fs.readdirSync(dirPath)
          .map(item => path.join(dirPath, item))
          .filter(itemPath => fs.statSync(itemPath).isDirectory());

        const subdirResults = subdirs.map(subdir =>
          this.validateDirectoryPermissions(subdir, options)
        );

        const allValid = subdirResults.every(r => r.isValid);

        if (!allValid) {
          result.isValid = false;
          result.subdirectories = subdirResults;
          result.message = `Directory or subdirectories have insecure permissions: ${dirPath}`;
        }
      }

      return result;
    } catch (error) {
      return {
        isValid: false,
        error: 'VALIDATION_ERROR',
        message: `Error validating directory permissions: ${error.message}`,
        dirPath
      };
    }
  }

  /**
   * Enforce secure access by setting appropriate permissions
   * @param {string} targetPath - Path to file or directory
   * @param {object} options - Enforcement options
   * @param {boolean} options.isDirectory - If true, treats path as directory
   * @param {boolean} options.strict - If true, applies most restrictive permissions
   * @param {boolean} options.recursive - If true, applies to all subdirectories (directories only)
   * @returns {object} Result of enforcement operation
   */
  enforceSecureAccess(targetPath, options = {}) {
    const { isDirectory = false, strict = true, recursive = false } = options;

    try {
      // Check if path exists
      if (!fs.existsSync(targetPath)) {
        return {
          success: false,
          error: 'PATH_NOT_FOUND',
          message: `Path does not exist: ${targetPath}`
        };
      }

      // Verify path type matches option
      const stats = fs.statSync(targetPath);
      const actuallyDirectory = stats.isDirectory();

      if (isDirectory && !actuallyDirectory) {
        return {
          success: false,
          error: 'TYPE_MISMATCH',
          message: `Path is not a directory: ${targetPath}`
        };
      }

      if (!isDirectory && actuallyDirectory) {
        return {
          success: false,
          error: 'TYPE_MISMATCH',
          message: `Path is a directory, not a file: ${targetPath}`
        };
      }

      // Determine target mode
      const targetMode = actuallyDirectory
        ? this.SECURE_DIR_MODE
        : this.SECURE_FILE_MODE;

      // Set permissions
      if (process.platform !== 'win32') {
        fs.chmodSync(targetPath, targetMode);
      }

      const result = {
        success: true,
        path: targetPath,
        appliedMode: this._formatMode(targetMode),
        appliedModeOctal: targetMode.toString(8),
        message: `Secure permissions applied to ${actuallyDirectory ? 'directory' : 'file'}: ${targetPath}`
      };

      // Recursive enforcement for directories
      if (actuallyDirectory && recursive) {
        const items = fs.readdirSync(targetPath);
        const enforcementResults = [];

        for (const item of items) {
          const itemPath = path.join(targetPath, item);
          const itemStats = fs.statSync(itemPath);

          const itemResult = this.enforceSecureAccess(itemPath, {
            isDirectory: itemStats.isDirectory(),
            strict,
            recursive: true
          });

          enforcementResults.push(itemResult);
        }

        result.recursiveResults = enforcementResults;
        result.allSuccess = enforcementResults.every(r => r.success);

        if (!result.allSuccess) {
          result.message += ' (some subdirectories/files failed)';
        }
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: 'ENFORCEMENT_ERROR',
        message: `Error enforcing secure access: ${error.message}`,
        path: targetPath
      };
    }
  }

  /**
   * Format permission mode to human-readable string
   * @private
   * @param {number} mode - Permission mode (octal number)
   * @returns {string} Human-readable permission string (e.g., "rw-------")
   */
  _formatMode(mode) {
    const permissions = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];
    const owner = permissions[(mode >> 6) & 7];
    const group = permissions[(mode >> 3) & 7];
    const others = permissions[mode & 7];
    return owner + group + others;
  }
}

module.exports = PermissionValidator;
