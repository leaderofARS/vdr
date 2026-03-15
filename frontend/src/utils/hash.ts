/**
 * Compute SHA-256 hash of a File object using the Web Crypto API.
 * 
 * @param {File} file 
 * @returns {Promise<string>} Hex representation of the hash
 */
export async function hashFile(file: File): Promise<string> {
  const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB chunks

  // For files under 50MB, use the simple path
  if (file.size <= 50 * 1024 * 1024) {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  const chunks: Uint8Array[] = [];
  let offset = 0;

  while (offset < file.size) {
    const end = Math.min(offset + CHUNK_SIZE, file.size);
    const chunk = file.slice(offset, end);
    const chunkBuffer = await chunk.arrayBuffer();
    chunks.push(new Uint8Array(chunkBuffer));
    offset = end;

    if ((offset / CHUNK_SIZE) % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const combined = new Uint8Array(totalLength);
  let pos = 0;
  for (const chunk of chunks) {
    combined.set(chunk, pos);
    pos += chunk.length;
  }

  const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
