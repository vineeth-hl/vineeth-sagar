/*
 * Tiny localStorage cache so the hero widgets can show the *last* thing that was
 * playing / watched when nothing is live right now. Written whenever Lanyard
 * reports an active Spotify track or YouTube video, read on mount.
 */

const key = (k) => `np:last:${k}`;

export function saveLast(k, data) {
    if (typeof window === 'undefined' || !data) return;
    try {
        window.localStorage.setItem(key(k), JSON.stringify({ ...data, savedAt: Date.now() }));
    } catch {
        /* storage unavailable — ignore */
    }
}

export function loadLast(k) {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(key(k));
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}
