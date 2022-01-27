export function toQueryString(queryObject: Record<string, string> | undefined): string {
  if (queryObject === undefined) return ''

  return Object.entries(queryObject).map(([key, value]) => {
    if (Array.isArray(value)) {
      return value.map(v => `${key}=${encodeURIComponent(v)}` , '').join('&')
    }
    return `${key}=${encodeURIComponent(value)}`
  }).join('&')
}