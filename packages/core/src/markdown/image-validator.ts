/**
 * Image validation utilities
 */

import { stat } from 'fs/promises';
import { existsSync } from 'fs';

export interface ImageValidation {
  exists: boolean;
  absolutePath: string;
  size?: number; // bytes
  sizeFormatted?: string; // "245 KB"
  errors: string[];
  warnings: string[];
}

/**
 * Validate an image file
 */
export async function validateImageFile(
  absolutePath: string,
): Promise<ImageValidation> {
  const validation: ImageValidation = {
    exists: false,
    absolutePath,
    errors: [],
    warnings: [],
  };

  // Check if file exists
  if (!existsSync(absolutePath)) {
    validation.errors.push('File not found');
    return validation;
  }

  validation.exists = true;

  // Get file size
  try {
    const stats = await stat(absolutePath);
    validation.size = stats.size;
    validation.sizeFormatted = formatBytes(stats.size);

    // Warn about large files (>2 MB)
    if (stats.size > 2 * 1024 * 1024) {
      validation.warnings.push(
        `Large file size: ${validation.sizeFormatted} (recommend <2 MB)`,
      );
    }

    // Error for very large files (>10 MB - WordPress typically rejects)
    if (stats.size > 10 * 1024 * 1024) {
      validation.errors.push(
        `File too large: ${validation.sizeFormatted} (WordPress limit typically 10 MB)`,
      );
    }
  } catch (error) {
    validation.errors.push(
      `Failed to read file: ${(error as Error).message}`,
    );
  }

  return validation;
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
