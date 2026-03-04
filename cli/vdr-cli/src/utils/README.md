# Permission Validator

## Overview

The `PermissionValidator` class provides utilities for validating and enforcing secure file and directory permissions in Unix-like systems (Linux, macOS).

## Features

- **File Permission Validation**: Check if files have secure permissions (600 by default)
- **Directory Permission Validation**: Check if directories have secure permissions (700 by default)
- **Permission Enforcement**: Automatically set secure permissions on files and directories
- **Recursive Operations**: Validate and enforce permissions recursively through directory trees
- **Flexible Configuration**: Support for strict and readable permission modes

## Usage

```javascript
const PermissionValidator = require('./permissionValidator');

const validator = new PermissionValidator();

// Validate file permissions
const fileResult = validator.validateFilePermissions('/path/to/file.txt');
if (!fileResult.isValid) {
  console.log(fileResult.message);
}

// Validate directory permissions
const dirResult = validator.validateDirectoryPermissions('/path/to/dir');
if (!dirResult.isValid) {
  console.log(dirResult.message);
}

// Enforce secure permissions on a file
validator.enforceSecureAccess('/path/to/file.txt', { isDirectory: false });

// Enforce secure permissions recursively on a directory
validator.enforceSecureAccess('/path/to/dir', { 
  isDirectory: true, 
  recursive: true 
});
```

## API Reference

### `validateFilePermissions(filePath, options)`

Validates file permissions against secure standards.

**Parameters:**
- `filePath` (string): Path to the file to validate
- `options` (object, optional):
  - `strict` (boolean): If true, requires most restrictive permissions (600). Default: true
  - `allowReadable` (boolean): If true, allows readable permissions (644). Default: false

**Returns:** Object with validation result
- `isValid` (boolean): Whether permissions are secure
- `currentMode` (string): Current permissions in human-readable format
- `expectedMode` (string): Expected permissions in human-readable format
- `currentModeOctal` (string): Current permissions in octal format
- `expectedModeOctal` (string): Expected permissions in octal format
- `filePath` (string): Path to the validated file
- `message` (string): Descriptive message
- `error` (string, optional): Error code if validation failed

### `validateDirectoryPermissions(dirPath, options)`

Validates directory permissions against secure standards.

**Parameters:**
- `dirPath` (string): Path to the directory to validate
- `options` (object, optional):
  - `strict` (boolean): If true, requires most restrictive permissions (700). Default: true
  - `allowReadable` (boolean): If true, allows readable permissions (755). Default: false
  - `recursive` (boolean): If true, validates all subdirectories. Default: false

**Returns:** Object with validation result (similar to validateFilePermissions)

### `enforceSecureAccess(targetPath, options)`

Enforces secure permissions on files or directories.

**Parameters:**
- `targetPath` (string): Path to file or directory
- `options` (object, optional):
  - `isDirectory` (boolean): If true, treats path as directory. Default: false
  - `strict` (boolean): If true, applies most restrictive permissions. Default: true
  - `recursive` (boolean): If true, applies to all subdirectories (directories only). Default: false

**Returns:** Object with enforcement result
- `success` (boolean): Whether enforcement succeeded
- `path` (string): Path to the target
- `appliedMode` (string): Applied permissions in human-readable format
- `appliedModeOctal` (string): Applied permissions in octal format
- `message` (string): Descriptive message
- `error` (string, optional): Error code if enforcement failed
- `recursiveResults` (array, optional): Results for recursive operations
- `allSuccess` (boolean, optional): Whether all recursive operations succeeded

## Permission Modes

### Secure Modes (Default)
- **Files**: 600 (rw-------) - Owner can read and write, no access for others
- **Directories**: 700 (rwx------) - Owner can read, write, and execute, no access for others

### Readable Modes
- **Files**: 644 (rw-r--r--) - Owner can read and write, others can read
- **Directories**: 755 (rwxr-xr-x) - Owner has full access, others can read and execute

## Platform Compatibility

**Note**: This utility is designed for Unix-like systems (Linux, macOS) where file permissions are fully supported. On Windows systems, the `fs.chmod()` function has limited effect and may not work as expected. For production use on Windows, consider using Windows-specific permission management tools or ACLs (Access Control Lists).

## Security Best Practices

1. **Sensitive Files**: Always use strict mode (600) for files containing sensitive data like:
   - Private keys
   - API tokens
   - Configuration files with credentials
   - Database connection strings

2. **Application Directories**: Use secure directory permissions (700) for:
   - Configuration directories
   - Data directories
   - Log directories containing sensitive information

3. **Regular Validation**: Periodically validate permissions on critical files and directories

4. **Recursive Enforcement**: Use with caution - ensure you understand the impact before applying permissions recursively

## Examples

### Securing a Configuration Directory

```javascript
const validator = new PermissionValidator();

// Validate and enforce secure permissions on config directory
const configDir = '/path/to/config';
const result = validator.enforceSecureAccess(configDir, {
  isDirectory: true,
  recursive: true
});

if (result.success) {
  console.log('Configuration directory secured');
} else {
  console.error('Failed to secure directory:', result.message);
}
```

### Validating Multiple Files

```javascript
const validator = new PermissionValidator();
const sensitiveFiles = [
  '/path/to/private.key',
  '/path/to/api-token.txt',
  '/path/to/database.config'
];

for (const file of sensitiveFiles) {
  const result = validator.validateFilePermissions(file);
  if (!result.isValid) {
    console.warn(`Insecure permissions on ${file}: ${result.message}`);
    // Optionally enforce secure permissions
    validator.enforceSecureAccess(file, { isDirectory: false });
  }
}
```

## Testing

Run the manual test script to verify functionality:

```bash
node cli/vdr-cli/src/utils/test-permission-validator.js
```

Note: Tests will only show expected results on Unix-like systems.
