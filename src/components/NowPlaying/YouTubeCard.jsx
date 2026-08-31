import React, { useEffect, useRef, useState } from 'react';
import TiltedCard from './TiltedCard';
import { saveLast, loadLast } from './lastMedia';

/**
 * "Watching on YouTube" widget for the hero — mirrors <NowPlaying/> (Spotify)
 * on the opposite corner. YouTube has no watch-history API, so this resolves
 * in order:
 *
 *   1. Currently watching  — a "Watching YouTube" Discord Rich Presence
 *      (PreMiD browser extension), read live via the Lanyard API + VITE_LANYARD_ID.
 *   2. Last watched        — the most-recently-added video in a public YouTube
 *      playlist you curate, via VITE_YOUTUBE_API_KEY + VITE_YOUTUBE_WATCHED_PLAYLIST_ID
 *      (one playlistItems.list call, 1 quota unit).
 *   3. Cached              — whatever it last showed (localStorage).
 *   4. Offline placeholder — nothing configured / available.
 */

const LANYARD_ID = import.meta.env.VITE_LANYARD_ID || '';
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
const WATCHED_PLAYLIST = import.meta.env.VITE_YOUTUBE_WATCHED_PLAYLIST_ID || '';

const PRESENCE_POLL_MS = 15000; // "currently watching" — want it responsive
const PLAYLIST_POLL_MS = 10 * 60 * 1000; // "last watched" — barely changes

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='84'>" +
      "<rect width='120' height='84' fill='#1d1d1d'/>" +
      "<path d='M50 30 L78 42 L50 54 Z' fill='#444444'/>" +
      '</svg>'
  );

const CARD_BG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'><rect width='8' height='8' fill='#151515'/></svg>");

const fmt = (ms) => {
  if (!ms || ms < 0) return '0:00';
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
};

const timeAgo = (iso) => {
  if (!iso) return '';
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  const units = [
    [31536000, 'y'],
    [2592000, 'mo'],
    [604800, 'w'],
    [86400, 'd'],
    [3600, 'h'],
    [60, 'm']
  ];
  for (const [sec, label] of units) if (s >= sec) return `${Math.floor(s / sec)}${label} ago`;
  return 'just now';
};

const YouTubeMark = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#FF0000"
      d="M23.5 6.2a3 3 0 0 0-2.11-2.13C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.39.52A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.13c1.89.52 9.39.52 9.39.52s7.5 0 9.39-.52a3 3 0 0 0 2.11-2.13A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8z"
    />
    <path fill="#fff" d="M9.6 15.6 15.8 12 9.6 8.4z" />
  </svg>
);

// pull { thumb, videoId } out of a Discord/PreMiD YouTube activity — the image
// key usually embeds the real thumbnail path (…/i.ytimg.com/vi/<id>/…)
function resolvePresenceMedia(activity) {
  const img = activity?.assets?.large_image || activity?.assets?.small_image || '';
  const m = img.match(/(?:i\.ytimg\.com|img\.youtube\.com)\/vi\/([\w-]{6,})/i);
  if (m) return { thumb: `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`, videoId: m[1] };
  let thumb = null;
  if (img.startsWith('mp:')) thumb = `https://media.discordapp.net/${img.slice(3)}`;
  else if (/^https?:\/\//.test(img)) thumb = img;
  else if (/^\d+$/.test(img) && activity.application_id) {
    thumb = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`;
  }
  return { thumb, videoId: null };
}

export default function YouTubeCard({ className = '' }) {
  const [now, setNow] = useState(null); // live "currently watching" (Lanyard)
  const [fromList, setFromList] = useState(null); // newest in the watched playlist
  const [cached] = useState(() => loadLast('yt-watch'));
  const [nowMs, setNowMs] = useState(() => Date.now());
  const pTimer = useRef(null);
  const lTimer = useRef(null);

  // 1. currently watching — Discord presence via Lanyard
  useEffect(() => {
    if (!LANYARD_ID) return undefined;
    let alive = true;
    const controller = new AbortController();

    async function poll() {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${LANYARD_ID}`, { signal: controller.signal });
        const json = await res.json();
        if (!alive) return;
        const acts = Array.isArray(json?.data?.activities) ? json.data.activities : [];
        const yt = acts.find((a) => /youtube/i.test(a?.name || '') || /youtube/i.test(a?.assets?.large_text || ''));
        if (yt) {
          const { thumb, videoId } = resolvePresenceMedia(yt);
          const v = {
            title: yt.details || yt.name || 'YouTube',
            channel: (yt.state || '').replace(/^by\s+/i, '') || 'YouTube',
            thumb: thumb || PLACEHOLDER,
            url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : 'https://www.youtube.com/',
            startMs: yt.timestamps?.start ?? null,
            endMs: yt.timestamps?.end ?? null
          };
          setNow(v);
          saveLast('yt-watch', { title: v.title, channel: v.channel, thumb: v.thumb, url: v.url });
        } else {
          setNow(null);
        }
      } catch (e) {
        if (alive && e.name !== 'AbortError') setNow(null);
      }
    }

    poll();
    lTimer.current = setInterval(() => {
      if (document.visibilityState === 'visible') poll();
    }, PRESENCE_POLL_MS);
    const onVis = () => document.visibilityState === 'visible' && poll();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      alive = false;
      controller.abort();
      clearInterval(lTimer.current);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  // 2. last watched — newest item in the curated playlist
  useEffect(() => {
    if (!API_KEY || !WATCHED_PLAYLIST) return undefined;
    let alive = true;
    const controller = new AbortController();

    async function fetchList() {
      try {
        const url =
          'https://www.googleapis.com/youtube/v3/playlistItems' +
          `?part=snippet&maxResults=50&playlistId=${WATCHED_PLAYLIST}&key=${API_KEY}`;
        const res = await fetch(url, { signal: controller.signal });
        const json = await res.json();
        if (!alive) return;
        const items = Array.isArray(json?.items) ? json.items : [];
        // playlistItems.snippet.publishedAt = when it was ADDED to the playlist
        const newest = items
          .filter((i) => i?.snippet?.resourceId?.videoId)
          .sort((a, b) => new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt))[0];
        if (!newest) return;
        const sn = newest.snippet;
        const t = sn.thumbnails || {};
        const v = {
          title: sn.title || 'YouTube',
          channel: sn.videoOwnerChannelTitle || sn.channelTitle || 'YouTube',
          thumb: (t.high || t.medium || t.default || {}).url || PLACEHOLDER,
          url: `https://www.youtube.com/watch?v=${sn.resourceId.videoId}`,
          addedAt: sn.publishedAt || ''
        };
        setFromList(v);
        saveLast('yt-watch', { title: v.title, channel: v.channel, thumb: v.thumb, url: v.url });
      } catch (e) {
        if (alive && e.name !== 'AbortError') {
          /* keep whatever we have */
        }
      }
    }

    fetchList();
    pTimer.current = setInterval(() => {
      if (document.visibilityState === 'visible') fetchList();
    }, PLAYLIST_POLL_MS);
    return () => {
      alive = false;
      controller.abort();
      clearInterval(pTimer.current);
    };
  }, []);

  // 1s ticker for the progress bar while a live video is playing
  useEffect(() => {
    if (!now?.startMs) return undefined;
    const t = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, [now]);

  const src = now || fromList || cached;
  const mode = now ? 'now' : src ? 'last' : 'off';
  const totalMs = now?.endMs && now?.startMs ? Math.max(0, now.endMs - now.startMs) : 0;
  const elapsedMs = now?.startMs ? Math.max(0, nowMs - now.startMs) : 0;
  const pct = totalMs ? Math.min(100, (elapsedMs / totalMs) * 100) : mode === 'last' ? 33 : 0;
  const caption = src ? `${src.title} — ${src.channel}` : 'Offline';
  const label =
    mode === 'now' ? 'YouTube · Watching' : mode === 'last' ? 'YouTube · Last Watched' : 'YouTube · Offline';

  const overlay = (
    <div className="flex h-full w-full items-center gap-3 rounded-[15px] border border-white/10 bg-[#161616] p-2.5">
      <img
        src={src?.thumb || PLACEHOLDER}
        alt=""
        className={`h-[84px] w-[120px] shrink-0 rounded-md object-cover ${mode === 'last' ? 'opacity-70' : ''}`}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="line-clamp-2 text-[13px] font-bold leading-tight text-white">{src?.title || 'Nothing here yet'}</p>
        <p className="truncate text-[11px] leading-tight text-white/55">{src?.channel || '—'}</p>

        <div className="mt-1.5 flex items-center gap-1.5">
          <YouTubeMark className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate text-[8.5px] font-semibold uppercase tracking-[0.18em] text-white/45">{label}</span>
        </div>

        <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#FF0000] transition-[width] duration-1000 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-0.5 flex justify-between text-[8px] tabular-nums text-white/40">
          <span>{mode === 'now' && totalMs ? fmt(elapsedMs) : ''}</span>
          <span>
            {mode === 'now' && totalMs ? fmt(totalMs) : mode === 'last' && src?.addedAt ? timeAgo(src.addedAt) : ''}
          </span>
        </div>
      </div>
    </div>
  );

  const card = (
    <TiltedCard
      imageSrc={CARD_BG}
      altText={caption}
      captionText={caption}
      containerHeight="112px"
      containerWidth="340px"
      imageHeight="112px"
      imageWidth="340px"
      rotateAmplitude={8}
      scaleOnHover={1.04}
      showMobileWarning={false}
      showTooltip={false}
      displayOverlayContent
      overlayContent={overlay}
    />
  );

  return (
    <div className={className}>
      {src?.url ? (
        <a href={src.url} target="_blank" rel="noopener noreferrer" aria-label={`Open YouTube — ${caption}`}>
          {card}
        </a>
      ) : (
        card
      )}
    </div>
  );
}
