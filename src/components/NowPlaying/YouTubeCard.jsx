import React, { useEffect, useRef, useState } from 'react';
import TiltedCard from './TiltedCard';
import { saveLast, loadLast } from './lastMedia';

/**
 * "Watching on YouTube" widget for the hero — mirrors <NowPlaying/> (Spotify),
 * on the opposite corner.
 *
 * Same data source: the Lanyard API mirrors your Discord presence. A "Watching
 * YouTube" Rich Presence (e.g. the PreMiD browser extension with the YouTube
 * presence enabled) shows up in `data.activities` as `{ name: "YouTube",
 * details: <video title>, state: <channel>, assets, timestamps }`.
 *
 * Needs the same VITE_LANYARD_ID. With no id, or when you're not watching
 * anything, it renders the "Offline" fallback so the layout never shifts.
 */

const LANYARD_ID = import.meta.env.VITE_LANYARD_ID || '';
const POLL_MS = 15000;

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>" +
      "<rect width='120' height='120' fill='#1d1d1d'/>" +
      "<path d='M46 40 L86 60 L46 80 Z' fill='#444444'/>" +
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

const YouTubeMark = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#FF0000"
      d="M23.5 6.2a3 3 0 0 0-2.11-2.13C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.39.52A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.13c1.89.52 9.39.52 9.39.52s7.5 0 9.39-.52a3 3 0 0 0 2.11-2.13A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8z"
    />
    <path fill="#fff" d="M9.6 15.6 15.8 12 9.6 8.4z" />
  </svg>
);

// Pull { thumb, videoId } out of a Discord/PreMiD YouTube activity. The image
// key usually embeds the real thumbnail path (…/i.ytimg.com/vi/<id>/…), which
// gives us both a stable thumbnail and the watch URL.
function resolveMedia(activity) {
  const img = activity?.assets?.large_image || activity?.assets?.small_image || '';
  const vid = img.match(/(?:i\.ytimg\.com|img\.youtube\.com)\/vi\/([\w-]{6,})/i);
  const videoId = vid ? vid[1] : null;
  if (videoId) return { thumb: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`, videoId };

  let thumb = null;
  if (img.startsWith('mp:')) thumb = `https://media.discordapp.net/${img.slice(3)}`;
  else if (/^https?:\/\//.test(img)) thumb = img;
  else if (/^\d+$/.test(img) && activity.application_id) {
    thumb = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`;
  }
  return { thumb, videoId: null };
}

export default function YouTubeCard({ className = '' }) {
  const [video, setVideo] = useState(null);
  const [last, setLast] = useState(() => loadLast('youtube')); // last video seen
  const [state, setState] = useState(LANYARD_ID ? 'loading' : 'offline'); // loading | watching | offline
  const [nowMs, setNowMs] = useState(() => Date.now());
  const timer = useRef(null);

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
          const { thumb, videoId } = resolveMedia(yt);
          const v = {
            title: yt.details || yt.name || 'YouTube',
            channel: (yt.state || '').replace(/^by\s+/i, '') || 'YouTube',
            thumb: thumb || PLACEHOLDER,
            url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : 'https://www.youtube.com/',
            startMs: yt.timestamps?.start ?? null,
            endMs: yt.timestamps?.end ?? null
          };
          setVideo(v);
          setState('watching');
          const remembered = { title: v.title, channel: v.channel, thumb: v.thumb, url: v.url };
          setLast(remembered);
          saveLast('youtube', remembered);
        } else {
          setVideo(null);
          setState('offline');
        }
      } catch (e) {
        if (alive && e.name !== 'AbortError') setState('offline');
      }
    }

    poll();
    timer.current = setInterval(() => {
      if (document.visibilityState === 'visible') poll();
    }, POLL_MS);
    const onVis = () => {
      if (document.visibilityState === 'visible') poll();
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      alive = false;
      controller.abort();
      clearInterval(timer.current);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  useEffect(() => {
    if (state !== 'watching') return undefined;
    const t = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, [state]);

  const watching = state === 'watching' && !!video;
  const src = watching ? video : last; // fall back to the last video seen
  const mode = watching ? 'now' : src ? 'last' : 'off';
  const totalMs = watching && video.endMs && video.startMs ? Math.max(0, video.endMs - video.startMs) : 0;
  const elapsedMs = watching && video.startMs ? Math.max(0, nowMs - video.startMs) : 0;
  const pct = totalMs ? Math.min(100, (elapsedMs / totalMs) * 100) : 0;
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
        <p className="line-clamp-2 text-[13px] font-bold leading-tight text-white">{src?.title || 'Nothing playing'}</p>
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
          <span>{watching && totalMs ? fmt(elapsedMs) : ''}</span>
          <span>{watching && totalMs ? fmt(totalMs) : ''}</span>
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
