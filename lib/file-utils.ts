// Extension to the existing utils.ts file

// Get file extension from filename
export function getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }
  
  // Format file size to human-readable format
  export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  // Generate a random ID
  export function generateId(length = 8): string {
    return Math.random().toString(36).substring(2, length + 2);
  }
  
  // Check if device is mobile
  export function isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }
  
  // Format date
  export function formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  
  // Parse page ranges (for PDF operations)
  export function parsePageRanges(rangeString: string, totalPages: number): number[] {
    if (!rangeString.trim()) return [];
    
    const pages: number[] = [];
    const ranges = rangeString.split(',').map(r => r.trim());
    
    for (const range of ranges) {
      if (range.includes('-')) {
        // Range like 1-5
        const [start, end] = range.split('-').map(Number);
        
        if (isNaN(start) || isNaN(end)) continue;
        if (start < 1 || end > totalPages || start > end) continue;
        
        for (let i = start; i <= end; i++) {
          if (!pages.includes(i)) pages.push(i);
        }
      } else {
        // Single page like 3
        const pageNum = Number(range);
        
        if (isNaN(pageNum)) continue;
        if (pageNum < 1 || pageNum > totalPages) continue;
        
        if (!pages.includes(pageNum)) pages.push(pageNum);
      }
    }
    
    return pages.sort((a, b) => a - b);
  }
  
  // Delay function (useful for animations)
  export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }