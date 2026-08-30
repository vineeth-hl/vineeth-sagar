import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';

/**
 * Unified contribution heatmap with a LeetCode / GitHub toggle.
 *
 * Both data sources are fetched client-side from public CORS-enabled proxies
 * (no auth token needed) and normalised to a single `[{ date, count }]` shape,
 * then rendered into a GitHub-style 53x7 grid. The colour scale and copy swap
 * with the active source. If a fetch fails the card shows a friendly message
 * and the profile link still works.
 */

const GH_USER = 'Vineeth-Sagar';
const LC_USER = 'vineethQuinz';

const THEME = {
    leetcode: {
        label: 'LeetCode',
        title: 'LeetCode Submissions',
        noun: 'submissions',
        profile: `https://leetcode.com/u/${LC_USER}/`,
        icon: <SiLeetcode />,
        // index 0 (empty) is overridden with --heat-empty; 1-4 are the amber ramp
        scale: ['#242424', '#6b4f18', '#9c7420', '#d29a28', '#ffb020'],
        scaleLight: ['#e9eaed', '#ffe0a3', '#ffc35a', '#f59e0b', '#c2740c'],
    },
    github: {
        label: 'GitHub',
        title: 'GitHub Contributions',
        noun: 'contributions',
        profile: `https://github.com/${GH_USER}`,
        icon: <FaGithub />,
        scale: ['#242424', '#0e4429', '#1d6d33', '#2ea043', '#39d353'],
        scaleLight: ['#e9eaed', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    },
};

// Track the active theme (toggled from the navbar via a class on <html>).
const useIsLight = () => {
    const [light, setLight] = useState(
        () => typeof document !== 'undefined' && document.documentElement.classList.contains('light')
    );
    useEffect(() => {
        const el = document.documentElement;
        const obs = new MutationObserver(() => setLight(el.classList.contains('light')));
        obs.observe(el, { attributes: true, attributeFilter: ['class'] });
        return () => obs.disconnect();
    }, []);
    return light;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const isoLocal = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const level = (count, max) => {
    if (!count) return 0;
    if (max <= 4) return Math.min(4, count);
    const r = count / max;
    return r > 0.75 ? 4 : r > 0.5 ? 3 : r > 0.25 ? 2 : 1;
};

const calToPoints = (cal) => {
    const obj = typeof cal === 'string' ? JSON.parse(cal) : cal || {};
    return Object.entries(obj).map(([ts, n]) => ({
        date: isoLocal(new Date(Number(ts) * 1000)),
        count: Number(n) || 0,
    }));
};

// Parse-safe JSON fetch: a rate-limit / error page returns non-JSON text, which
// must not throw uncaught - it should just fall through to the next source.
async function getJSON(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${url} -> ${r.status}`);
    return r.json();
}

const CACHE_TTL = 6 * 60 * 60 * 1000; // 6h

function readCache(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const { t, points } = JSON.parse(raw);
        if (Date.now() - t > CACHE_TTL) return null;
        return points;
    } catch {
        return null;
    }
}
function writeCache(key, points) {
    try {
        localStorage.setItem(key, JSON.stringify({ t: Date.now(), points }));
    } catch {
        /* private mode / quota - ignore */
    }
}

async function fetchGitHub() {
    const j = await getJSON(`https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`);
    return (j.contributions || []).map((c) => ({ date: c.date, count: c.count || 0 }));
}

async function fetchLeetCode() {
    // LeetCode's own GraphQL endpoint sends no CORS headers, so we go through a
    // public CORS-enabled proxy - with a backup in case one is down / rate-limited.
    const sources = [
        `https://leetcode-api-pied.vercel.app/user/${LC_USER}/calendar`,
        `https://alfa-leetcode-api.onrender.com/${LC_USER}/calendar`,
    ];
    let lastErr;
    for (const url of sources) {
        try {
            const j = await getJSON(url);
            if (j && j.submissionCalendar) return calToPoints(j.submissionCalendar);
            lastErr = new Error('no submissionCalendar');
        } catch (e) {
            lastErr = e;
        }
    }
    throw lastErr || new Error('LeetCode request failed');
}

const ActivityHeatmap = () => {
    const [activeChart, setActiveChart] = useState('leetcode');
    const [data, setData] = useState({ leetcode: null, github: null });
    const [status, setStatus] = useState({ leetcode: 'idle', github: 'idle' });

    const load = useCallback(async (which) => {
        const cacheKey = `activity:${which}`;
        const cached = readCache(cacheKey);
        if (cached) {
            setData((d) => ({ ...d, [which]: cached }));
            setStatus((s) => ({ ...s, [which]: 'done' }));
        } else {
            setStatus((s) => ({ ...s, [which]: 'loading' }));
        }
        try {
            const points = which === 'github' ? await fetchGitHub() : await fetchLeetCode();
            writeCache(cacheKey, points);
            setData((d) => ({ ...d, [which]: points }));
            setStatus((s) => ({ ...s, [which]: 'done' }));
        } catch {
            // keep showing cached data if we have it; only error when we have nothing
            setStatus((s) => ({ ...s, [which]: cached ? 'done' : 'error' }));
        }
    }, []);

    useEffect(() => {
        if (status[activeChart] === 'idle') load(activeChart);
    }, [activeChart, status, load]);

    const theme = THEME[activeChart];
    const isLight = useIsLight();
    const scale = isLight ? theme.scaleLight : theme.scale;

    const { weeks, total, max, monthLabels } = useMemo(() => {
        const points = data[activeChart] || [];
        const counts = new Map();
        for (const p of points) counts.set(p.date, (counts.get(p.date) || 0) + p.count);

        const end = new Date();
        end.setHours(0, 0, 0, 0);
        const windowStart = new Date(end);
        windowStart.setDate(windowStart.getDate() - 364);
        const gridStart = new Date(windowStart);
        gridStart.setDate(gridStart.getDate() - gridStart.getDay()); // back to Sunday

        const wk = [];
        let tot = 0;
        let mx = 0;
        const cur = new Date(gridStart);
        while (cur <= end) {
            const week = [];
            for (let i = 0; i < 7; i++) {
                const inRange = cur >= windowStart && cur <= end;
                const count = counts.get(isoLocal(cur)) || 0;
                week.push({ date: isoLocal(cur), count, inRange });
                if (inRange) {
                    tot += count;
                    if (count > mx) mx = count;
                }
                cur.setDate(cur.getDate() + 1);
            }
            wk.push(week);
        }

        const labels = [];
        let lastMo = -1;
        wk.forEach((week, i) => {
            const first = new Date(week[0].date);
            const mo = first.getMonth();
            if (mo !== lastMo && first.getDate() <= 7) {
                labels.push({ i, label: MONTHS[mo] });
                lastMo = mo;
            }
        });

        return { weeks: wk, total: tot, max: mx, monthLabels: labels };
    }, [data, activeChart]);

    const state = status[activeChart];

    return (
        <section
            id="contributions"
            className="relative py-24 px-6 md:px-12 bg-background border-t border-line"
        >
            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-accent-gold"
                    >
                        Open Source Contributions
                    </motion.h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15, duration: 0.6 }}
                        className="h-0.5 w-16 bg-accent-blue mx-auto rounded-full"
                    />
                </div>

                {/* Source toggle */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex p-1 rounded-md bg-card border border-line">
                        {['leetcode', 'github'].map((k) => (
                            <button
                                key={k}
                                onClick={() => setActiveChart(k)}
                                className={`relative px-6 py-2 rounded text-sm font-semibold transition-colors duration-200 ${
                                    activeChart === k ? 'text-white' : 'text-secondary hover:text-primary'
                                }`}
                            >
                                {activeChart === k && (
                                    <motion.span
                                        layoutId="chartToggle"
                                        className="absolute inset-0 rounded bg-accent-blue"
                                        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    {THEME[k].icon}
                                    {THEME[k].label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Card */}
                <motion.div
                    key={activeChart}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="mx-auto max-w-4xl rounded-lg bg-card border border-line p-5 md:p-8"
                >
                    <h3 className="text-center text-lg md:text-xl font-bold text-primary mb-6">
                        {theme.title}
                    </h3>

                    {state === 'error' ? (
                        <p className="py-10 text-center text-sm text-secondary">
                            Couldn&apos;t load {theme.label} activity right now. Try the profile link below.
                        </p>
                    ) : (
                        <>
                            {/* Full-width grid: columns flex to fit, so the whole
                                year is always visible with no horizontal scroll. */}
                            <div className="w-full">
                                {/* Month labels */}
                                <div className="relative h-4 mb-1 w-full">
                                    {state === 'done' &&
                                        monthLabels.map((m) => (
                                            <span
                                                key={m.i}
                                                className="absolute top-0 text-[10px] sm:text-[11px] font-medium text-secondary"
                                                style={{ left: `${(m.i / weeks.length) * 100}%` }}
                                            >
                                                {m.label}
                                            </span>
                                        ))}
                                </div>

                                {/* Grid */}
                                <div className="flex w-full gap-[2px] sm:gap-[3px]">
                                    {weeks.map((week, wi) => (
                                        <div key={wi} className="flex flex-1 flex-col gap-[2px] sm:gap-[3px]">
                                            {week.map((cell, di) => (
                                                <div
                                                    key={di}
                                                    title={
                                                        cell.inRange && state === 'done'
                                                            ? `${cell.count} ${theme.noun} on ${cell.date}`
                                                            : undefined
                                                    }
                                                    className={`aspect-square w-full rounded-[2px] ${
                                                        state === 'loading' ? 'animate-pulse' : ''
                                                    }`}
                                                    style={{
                                                        backgroundColor: !cell.inRange
                                                            ? 'transparent'
                                                            : state === 'done' && level(cell.count, max) > 0
                                                            ? scale[level(cell.count, max)]
                                                            : 'var(--heat-empty)',
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer: total + legend */}
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[12px] text-secondary">
                                <span>
                                    {state === 'done'
                                        ? `${total.toLocaleString()} ${theme.noun} in the last year`
                                        : 'Loading activity…'}
                                </span>
                                <span className="flex items-center gap-1">
                                    Less
                                    {scale.map((c, i) => (
                                        <span
                                            key={i}
                                            className="h-[11px] w-[11px] rounded-[2px]"
                                            style={{ backgroundColor: i === 0 ? 'var(--heat-empty)' : c }}
                                        />
                                    ))}
                                    More
                                </span>
                            </div>
                        </>
                    )}

                    {/* Profile link */}
                    <div className="mt-6 flex justify-center">
                        <a
                            href={theme.profile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-md border border-line bg-background px-4 py-2 text-sm font-semibold text-secondary hover:text-primary hover:border-accent-blue transition-colors"
                        >
                            {theme.icon}
                            View {theme.label} Profile
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ActivityHeatmap;
