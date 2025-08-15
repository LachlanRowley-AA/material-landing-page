// lib/serverCache.ts
type CacheEntry = { data: any; timestamp: number };

const cache: Record<string, CacheEntry> = {};

export async function fetchWithCache(url: string, ttl = 120_000) {
  // 2 min TTL
  const now = Date.now();
  const cached = cache[url];

  if (cached && now - cached.timestamp < ttl) {
    // Serve from cache
    return cached.data;
  }

  // Fetch fresh data
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`);
  }
  const data = await res.json();

  // Save to cache
  cache[url] = { data, timestamp: now };
  return data;
}
