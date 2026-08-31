import React, { useEffect, useRef, useState } from 'react';
import TiltedCard from './TiltedCard';
import { saveLast, loadLast } from './lastMedia';

/**
 * Live "Now Playing" widget for the hero — a wide card: album art on the left,
 * track / artist / Spotify label / progress bar on the right.
 *
 * Data comes from the Lanyard API (https://api.lanyard.rest) — a free, keyless,
 * CORS-friendly service that mirrors your Spotify status via Discord. To enable:
 *   1. join https://discord.gg/lanyard
 *   2. Discord → Settings → Connections → connect Spotify
 *   3. Discord → Settings → Advanced → Developer Mode on, right-click your name → Copy User ID
 *   4. put that id in .env.local as VITE_LANYARD_ID (see .env.example)
 *
 * With no id set, or when nothing is playing, it renders the "Offline" fallback
 * so the layout never shifts.
 */

const LANYARD_ID = import.meta.env.VITE_LANYARD_ID || '';
const POLL_MS = 10000;

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>" +
      "<rect width='120' height='120' fill='#1d1d1d'/>" +
      "<text x='50%' y='60%' font-size='58' fill='#444444' text-anchor='middle' font-family='sans-serif'>&#9834;</text>" +
      '</svg>'
  );

const CARD_BG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'><rect width='8' height='8' fill='#151515'/></svg>");

const fmt = (ms) => {
  if (!ms || ms < 0) return '0:00';
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const SpotifyMark = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#1DB954" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 0 1-.857.208c-2.348-1.435-5.304-1.76-8.785-.964a.622.622 0 1 1-.277-1.215c3.809-.871 7.076-.496 9.712 1.115a.623.623 0 0 1 .207.856zm1.223-2.722a.78.78 0 0 1-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166A.779.779 0 1 1 6.32 11.1c3.632-1.102 8.147-.568 11.234 1.328a.78.78 0 0 1 .255 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71a.935.935 0 1 1-.542-1.79c3.532-1.072 9.404-.865 13.115 1.338a.936.936 0 1 1-.954 1.61z" />
  </svg>
);

export default function NowPlaying({ className = '' }) {
  const [track, setTrack] = useState(null);
  const [last, setLast] = useState(() => loadLast('spotify')); // last track seen playing
  const [state, setState] = useState('loading'); // loading | playing | offline
  const [nowMs, setNowMs] = useState(() => Date.now());
  const timer = useRef(null);

  useEffect(() => {
    if (!LANYARD_ID) {
      setState('offline');
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.info('[NowPlaying] set VITE_LANYARD_ID (your Discord user id) to enable the Spotify widget — see .env.example');
      }
      return undefined;
    }

    let alive = true;
    const controller = new AbortController();

    async function poll() {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${LANYARD_ID}`, { signal: controller.signal });
        const json = await res.json();
        if (!alive) return;
        const sp = json?.data?.spotify;
        if (json?.data?.listening_to_spotify && sp) {
          const t = {
            song: sp.song || '',
            artist: (sp.artist || '').replace(/;\s*/g, ', '),
            albumArt: sp.album_art_url || PLACEHOLDER,
            url: sp.track_id ? `https://open.spotify.com/track/${sp.track_id}` : null,
            startMs: sp.timestamps?.start ?? null,
            endMs: sp.timestamps?.end ?? null
          };
          setTrack(t);
          setState('playing');
          const remembered = { song: t.song, artist: t.artist, albumArt: t.albumArt, url: t.url };
          setLast(remembered);
          saveLast('spotify', remembered);
        } else {
          setTrack(null);
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

  // 1s ticker for the progress bar while a track is playing
  useEffect(() => {
    if (state !== 'playing') return undefined;
    const t = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, [state]);

  const playing = state === 'playing' && !!track;
  const src = playing ? track : last; // fall back to the last track seen
  const mode = playing ? 'now' : src ? 'last' : 'off';
  const totalMs = playing && track.endMs && track.startMs ? Math.max(0, track.endMs - track.startMs) : 0;
  const elapsedMs = playing && track.startMs ? Math.min(totalMs, Math.max(0, nowMs - track.startMs)) : 0;
  const pct = totalMs ? (elapsedMs / totalMs) * 100 : 0;
  const caption = src ? `${src.song} — ${src.artist}` : 'Offline';
  const label =
    mode === 'now' ? 'Spotify · Now Playing' : mode === 'last' ? 'Spotify · Last Played' : 'Spotify · Offline';

  const overlay = (
    <div className="flex h-full w-full items-center gap-3 rounded-[15px] border border-white/10 bg-[#161616] p-2.5">
      <img
        src={src?.albumArt || PLACEHOLDER}
        alt=""
        className={`h-[84px] w-[84px] shrink-0 rounded-md object-cover ${mode === 'last' ? 'opacity-70' : ''}`}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate text-[13px] font-bold leading-tight text-white">{src?.song || 'Nothing playing'}</p>
        <p className="truncate text-[11px] leading-tight text-white/55">{src?.artist || '—'}</p>

        <div className="mt-1.5 flex items-center gap-1.5">
          <SpotifyMark className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate text-[8.5px] font-semibold uppercase tracking-[0.18em] text-white/45">{label}</span>
        </div>

        <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-accent-blue transition-[width] duration-1000 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-0.5 flex justify-between text-[8px] tabular-nums text-white/40">
          <span>{playing ? fmt(elapsedMs) : ''}</span>
          <span>{playing ? fmt(totalMs) : ''}</span>
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
        <a href={src.url} target="_blank" rel="noopener noreferrer" aria-label={`Open "${caption}" on Spotify`}>
          {card}
        </a>
      ) : (
        card
      )}
    </div>
  );
}
