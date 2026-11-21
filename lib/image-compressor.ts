export interface ImageCompressionOptions {
  /** Maximum output width in pixels (defaults to 1920) */
  maxWidth?: number;
  /** Maximum output height in pixels (defaults to 1920) */
  maxHeight?: number;
  /** Image quality between 0.1 and 1.0 (defaults to 0.8) */
  quality?: number;
  /** Target maximum file size in megabytes (defaults to 2MB) */
  maxSizeMB?: number;
  /** Desired output mime type (defaults to 'image/webp' for PNGs or 'image/jpeg' for other images) */
  mimeType?: "image/jpeg" | "image/webp" | "image/png";
}

/**
 * Compresses and resizes an image file in the browser before upload using HTML5 Canvas.
 * - Drastically reduces image payload sizes (often 70%-90% reduction).
 * - Preserves aspect ratio with max dimension bounds.
 * - Gracefully falls back to original file if compression fails, isn't smaller, or if file is not an image (e.g. video, SVG, GIF).
 */
export async function compressImageFile(
  file: File,
  options: ImageCompressionOptions = {},
): Promise<File> {
  // If running on server or invalid file, return original
  if (typeof window === "undefined" || !file || !(file instanceof File)) {
    return file;
  }

  // Only compress images
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // Preserve vector SVGs and animated GIFs
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  try {
    const maxWidth = options.maxWidth ?? 1920;
    const maxHeight = options.maxHeight ?? 1920;
    const targetQuality = options.quality ?? 0.8;
    const maxSizeBytes = (options.maxSizeMB ?? 2) * 1024 * 1024;

    // Default to WebP for PNG to preserve transparency with superior compression; otherwise JPEG
    const outputMime =
      options.mimeType ||
      (file.type === "image/png" ? "image/webp" : "image/jpeg");

    // Load image into an HTMLImageElement
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    try {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () =>
          reject(new Error("Failed to load image for compression"));
        img.src = objectUrl;
      });
    } finally {
      URL.revokeObjectURL(objectUrl);
    }

    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;

    // If dimensions are missing, fallback to original
    if (!width || !height) {
      return file;
    }

    // Scale dimensions while maintaining aspect ratio
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return file;
    }

    // If JPEG, fill white background to prevent transparent areas turning black
    if (outputMime === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(img, 0, 0, width, height);

    const getBlob = (quality: number): Promise<Blob | null> =>
      new Promise((resolve) => canvas.toBlob(resolve, outputMime, quality));

    let currentQuality = targetQuality;
    let blob = await getBlob(currentQuality);

    if (!blob) {
      return file;
    }

    // If still exceeds max size, perform adaptive reduction steps
    let attempts = 0;
    while (blob.size > maxSizeBytes && currentQuality > 0.4 && attempts < 3) {
      currentQuality -= 0.15;
      attempts++;
      const smallerBlob = await getBlob(currentQuality);
      if (smallerBlob) {
        blob = smallerBlob;
      }
    }

    // Only return compressed file if it's actually smaller than the original
    if (blob.size >= file.size) {
      return file;
    }

    const ext = outputMime === "image/webp" ? ".webp" : ".jpg";
    const baseName = file.name.replace(/\.[^/.]+$/, "") || "upload";
    const newFileName = `${baseName}${ext}`;

    return new File([blob], newFileName, {
      type: outputMime,
      lastModified: Date.now(),
    });
  } catch (err) {
    console.warn(
      "Image compression skipped, falling back to original file:",
      err,
    );
    return file;
  }
}
