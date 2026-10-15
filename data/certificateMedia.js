/**
 * Browser-only helpers for certificates (used by the admin panel):
 * watermarked public previews, single-file download and "download all" ZIP.
 */

import { getCertificateFile } from './certificateStore';

const PREVIEW_WIDTH = 960;
const PREVIEW_MAX_CHARS = 600_000; // keep the public doc small
const WATERMARK = '© Devesh Kumar Mandal · preview only';

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not read this image.'));
    img.src = src;
  });
}

/** Render page 1 of a PDF onto a canvas. */
async function renderPdfFirstPage(file) {
  // Run pdf.js in the main thread — avoids bundling a separate worker file
  await import('pdfjs-dist/build/pdf.worker.min.mjs');
  const pdfjs = await import('pdfjs-dist');
  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  try {
    const pdf = await task.promise;
    const page = await pdf.getPage(1);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: (PREVIEW_WIDTH * 1.5) / base.width });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvas, canvasContext: canvas.getContext('2d'), viewport }).promise;
    return canvas;
  } finally {
    await task.destroy();
  }
}

function drawWatermark(ctx, w, h) {
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-Math.PI / 7);
  const size = Math.round(w / 28);
  ctx.font = `600 ${size}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(110, 110, 135, 0.30)';
  const stepY = size * 4.2;
  const stepX = ctx.measureText(WATERMARK).width + size * 3;
  for (let y = -h; y < h; y += stepY) {
    const offset = (Math.round(y / stepY) % 2) * (stepX / 2);
    for (let x = -w * 1.2; x < w * 1.2; x += stepX) {
      ctx.fillText(WATERMARK, x + offset, y);
    }
  }
  ctx.restore();
}

/**
 * Build the public preview: downscaled, watermarked JPEG data URL.
 * The full-resolution original never goes into the public document.
 */
export async function makeCertificatePreview(file) {
  let source;
  if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
    source = await renderPdfFirstPage(file);
  } else if (file.type.startsWith('image/')) {
    const url = URL.createObjectURL(file);
    try { source = await loadImage(url); } finally { URL.revokeObjectURL(url); }
  } else {
    throw new Error('Use a PDF or an image (PNG / JPG / WEBP).');
  }

  const scale = Math.min(1, PREVIEW_WIDTH / source.width);
  const w = Math.round(source.width * scale);
  const h = Math.round(source.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(source, 0, 0, w, h);
  drawWatermark(ctx, w, h);

  for (let q = 0.72; q >= 0.3; q -= 0.1) {
    const url = canvas.toDataURL('image/jpeg', q);
    if (url.length <= PREVIEW_MAX_CHARS) return url;
  }
  return canvas.toDataURL('image/jpeg', 0.25);
}

/* ── Downloads ───────────────────────────────────── */

function saveBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function safeName(cert) {
  const ext = (cert.fileName || '').match(/\.[a-z0-9]+$/i)?.[0] || '';
  const base = `${cert.title || 'certificate'} - ${cert.issuer || ''}`
    .replace(/[\\/:*?"<>|]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return base + ext;
}

export async function downloadCertificate(cert) {
  const blob = await getCertificateFile(cert);
  saveBlob(blob, safeName(cert));
}

/** Bundle every stored certificate file into one ZIP. Returns how many were included. */
export async function downloadAllCertificates(certs) {
  const { zipSync } = await import('fflate');
  const files = {};
  const used = new Set();
  for (const cert of certs.filter((c) => c.chunkCount)) {
    const blob = await getCertificateFile(cert);
    const original = safeName(cert);
    let name = original;
    for (let n = 2; used.has(name); n++) name = original.replace(/(\.[^.]+)?$/, ` (${n})$1`);
    used.add(name);
    files[name] = new Uint8Array(await blob.arrayBuffer());
  }
  const count = Object.keys(files).length;
  if (count === 0) throw new Error('No certificate files to download yet.');
  // PDFs and images are already compressed — store them as-is
  const zip = zipSync(files, { level: 0 });
  saveBlob(new Blob([zip], { type: 'application/zip' }), 'Devesh-Kumar-Mandal-certificates.zip');
  return count;
}
