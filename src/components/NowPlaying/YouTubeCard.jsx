import React, { useEffect, useRef, useState } from 'react';
import TiltedCard from './TiltedCard';
import { saveLast, loadLast } from './lastMedia';

/**
 * "Latest on YouTube" widget for the hero — mirrors <NowPlaying/> (Spotify) on
 * the opposite corner. Shows your most recent upload via the YouTube Data API.
 *
 * Needs, in .env.local:
 *   VITE_YOUTUBE_API_KEY      — a YouTube Data API v3 key (referrer-restricted)
 *   VITE_YOUTUBE_CHANNEL_ID   — your channel id (starts with UC…)
 *
 * Quota: the uploads playlist is `UC…` -> `UU…`, so one `playlistItems.list`
 * call (1 unit) gets the newest video — no `search` (100 units) needed. The
 * result is cached in localStorage so the card shows instantly on the next
 * load and survives an API hiccup. With no key it renders the "Offline"
 * fallback so the layout never shifts.
 */

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID || '';
const UPLOADS_PLAYLIST = /^UC/.test(CHANNEL_ID) ? `UU${CHANNEL_ID.slice(2)}` : CHANNEL_ID;
const REFRESH_MS = 30 * 60 * 1000; // latest upload rarely changes

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

const YouTubeMark = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#FF0000"
      d="M23.5 6.2a3 3 0 0 0-2.11-2.13C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.39.52A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.13c1.89.52 9.39.52 9.39.52s7.5 0 9.39-.52a3 3 0 0 0 2.11-2.13A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8z"
    />
    <path fill="#fff" d="M9.6 15.6 15.8 12 9.6 8.4z" />
  </svg>
);

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

export default function YouTubeCard({ className = '' }) {
  const [video, setVideo] = useState(() => loadLast('youtube')); // cached last upload
  const [state, setState] = useState(API_KEY && CHANNEL_ID ? 'loading' : 'offline'); // loading | ok | offline
  const timer = useRef(null);

  useEffect(() => {
    if (!API_KEY || !CHANNEL_ID) return undefined;
    let alive = true;
    const controller = new AbortController();

    async function fetchLatest() {
      try {
        const url =
          'https://www.googleapis.com/youtube/v3/playlistItems' +
          `?part=snippet&maxResults=1&playlistId=${UPLOADS_PLAYLIST}&key=${API_KEY}`;
        const res = await fetch(url, { signal: controller.signal });
        const json = await res.json();
        if (!alive) return;
        const sn = json?.items?.[0]?.snippet;
        const vid = sn?.resourceId?.videoId;
        if (!sn || !vid) {
          if (!video) setState('offline');
          return;
        }
        const t = sn.thumbnails || {};
        const v = {
          title: sn.title || 'YouTube',
          channel: sn.channelTitle || 'YouTube',
          thumb: (t.high || t.medium || t.default || {}).url || PLACEHOLDER,
          url: `https://www.youtube.com/watch?v=${vid}`,
          publishedAt: sn.publishedAt || ''
        };
        setVideo(v);
        setState('ok');
        saveLast('youtube', v);
      } catch (e) {
        if (alive && e.name !== 'AbortError' && !video) setState('offline');
      }
    }

    fetchLatest();
    timer.current = setInterval(() => {
      if (document.visibilityState === 'visible') fetchLatest();
    }, REFRESH_MS);
    const onVis = () => {
      if (document.visibilityState === 'visible') fetchLatest();
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      alive = false;
      controller.abort();
      clearInterval(timer.current);
      document.removeEventListener('visibilitychange', onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const has = !!video && (state === 'ok' || state === 'loading');
  const src = has ? video : null;
  const caption = src ? `${src.title} — ${src.channel}` : 'Offline';

  const overlay = (
    <div className="flex h-full w-full items-center gap-3 rounded-[15px] border border-white/10 bg-[#161616] p-2.5">
      <img
        src={src?.thumb || PLACEHOLDER}
        alt=""
        className="h-[84px] w-[120px] shrink-0 rounded-md object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="line-clamp-2 text-[13px] font-bold leading-tight text-white">
          {src?.title || 'Nothing here yet'}
        </p>
        <p className="truncate text-[11px] leading-tight text-white/55">{src?.channel || '—'}</p>

        <div className="mt-1.5 flex items-center gap-1.5">
          <YouTubeMark className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate text-[8.5px] font-semibold uppercase tracking-[0.18em] text-white/45">
            {src ? 'YouTube · Latest' : 'YouTube · Offline'}
          </span>
        </div>

        <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/3 rounded-full bg-[#FF0000]" />
        </div>
        <div className="mt-0.5 flex justify-between text-[8px] tabular-nums text-white/40">
          <span>{src ? 'New upload' : ''}</span>
          <span>{src ? timeAgo(src.publishedAt) : ''}</span>
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
        <a href={src.url} target="_blank" rel="noopener noreferrer" aria-label={`Watch "${caption}" on YouTube`}>
          {card}
        </a>
      ) : (
        card
      )}
    </div>
  );
}
