/**
 * Compute SHA-256 hash of a File object using the Web Crypto API.
 * 
 * @param {File} file 
 * @returns {Promise<string>} Hex representation of the hash
 */
export async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
