const PLACEHOLDER = /^\s*\[[^[\]]+\]\s*$/;

export function isPlaceholder(value: string): boolean {
  return PLACEHOLDER.test(value);
}

/** Real copy, or null when the value is blank or still a [PLACEHOLDER]. */
export function visibleText(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || isPlaceholder(trimmed)) return null;
  return trimmed;
}

export function joinVisible(parts: string[], separator = ", "): string {
  return parts
    .map((part) => visibleText(part))
    .filter((part): part is string => part !== null)
    .join(separator);
}

export function httpUrl(value: string): string | null {
  const trimmed = visibleText(value);
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function mapsHref(explicitUrl: string, address: string): string | null {
  const explicit = httpUrl(explicitUrl);
  if (explicit) return explicit;
  const place = visibleText(address);
  if (!place) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
}
