/**
 * Convert bytes to a human-readable string.
 * @param bytes - The number of bytes.
 * @param opts - Optional settings.
 *   - si: Use SI units (true = 1000, false = 1024). Default: false (IEC).
 *   - decimals: Number of decimal places. Default: 2.
 */
export function formatBytes(bytes: number, opts: { decimals?: number; si?: boolean } = {}): string {
  const { decimals = 2, si = false } = opts

  if (!Number.isFinite(bytes)) {
    return 'NaN'
  }
  if (bytes === 0) {
    return '0 B'
  }

  const base = si ? 1000 : 1024
  const units = si
    ? ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const exponent = Math.floor(Math.log(bytes) / Math.log(base))
  const value = bytes / Math.pow(base, exponent)

  return `${value.toFixed(decimals)} ${units[exponent]}`
}
