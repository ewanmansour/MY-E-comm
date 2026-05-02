import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const defaultUploadDir = join(__dirname, '..', '..', '..', 'frontend', 'public', 'uploads');
const allowedMimeTypes = new Map([
  ['image/jpeg', '.jpg'],
  ['image/jpg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
  ['image/heic', '.heic'],
]);

function safeName(fileName) {
  return String(fileName || 'product')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .slice(0, 60);
}

export async function saveUploadedImage({ fileName, dataUrl }) {
  const dataString = String(dataUrl || '');
  if (!dataString.startsWith('data:')) {
    const snippet = dataString.length === 0 ? "EMPTY_STRING" : dataString.substring(0, 30);
    const error = new Error(`Invalid image data format. Expected dataUrl to start with data: but got: [${snippet}]`);
    error.status = 400;
    throw error;
  }

  const base64Index = dataString.indexOf('base64,');
  if (base64Index === -1) {
    const error = new Error('Invalid image data format. Missing base64,');
    error.status = 400;
    throw error;
  }

  const firstSemicolon = dataString.indexOf(';');
  const mimeType = firstSemicolon > 5 ? dataString.substring(5, firstSemicolon) : '';
  const base64Data = dataString.substring(base64Index + 7);
  let extension = allowedMimeTypes.get(mimeType);
  
  if (!extension) {
    extension = extname(fileName || '').toLowerCase();
  }

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic'];
  
  if (!allowedExtensions.includes(extension)) {
    const error = new Error(`File format ${extension || mimeType} is not allowed. Only JPG, PNG, WEBP, GIF, and HEIC.`);
    error.status = 400;
    throw error;
  }

  const buffer = Buffer.from(base64Data, 'base64');

  if (buffer.length > 5 * 1024 * 1024) {
    const error = new Error('Image must be 5MB or less.');
    error.status = 400;
    throw error;
  }

  const uploadDir = process.env.UPLOAD_DIR || defaultUploadDir;
  await mkdir(uploadDir, { recursive: true });

  const finalName = `${Date.now()}-${safeName(fileName)}${extension}`;
  await writeFile(join(uploadDir, finalName), buffer);

  return `/uploads/${finalName}`;
}
