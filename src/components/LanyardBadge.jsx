import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const CARD_W = 250;
const CARD_H = 350;
const DROP = 112;   // resting distance: anchor -> card top edge
const TAB = 20;     // horizontal offset where each lanyard leg meets the clip

/**
 * A digital ID card on a lanyard, driven by a real 2D physics simulation
 * (matter-js). It swings in on load and can be grabbed, dragged and thrown
 * with the mouse; gravity + the cord settle it back to rest.
 *
 * Why it stays smooth and never spins out:
 *  - The card body has infinite rotational inertia, so it only translates.
 *    The physics is a clean point-pendulum with a single stable equilibrium
 *    (straight down) - it can't drift, wobble or flip.
 *  - The visible tilt is derived from the cord direction (anchor -> card), so
 *    the card always hangs aligned with its strap, like a real lanyard.
 *  - One fixed-timestep Engine.update() per animation frame (Matter's stable
 *    usage) with a damped, moderately soft cord.
 *
 * No clipping: the cord is short enough that the swing arc stays inside the
 * badge column, and the scene sits above the text (z-20) so a wide swing
 * floats over it instead of disappearing behind it.
 */
const LanyardBadge = ({ photo, name = 'Vineeth Sagar H L', role = 'AI / ML Undergrad' }) => {
    const sceneRef = useRef(null);
    const cardRef = useRef(null);
    const ropeRef = useRef(null);
    const rafRef = useRef(null);
    const [version, setVersion] = useState(0); // bumped on meaningful resize -> rebuild

    // Rebuild the world when the container is resized noticeably.
    useEffect(() => {
        const el = sceneRef.current;
        if (!el) return;
        let w = el.clientWidth;
        let h = el.clientHeight;
        let t;
        const ro = new ResizeObserver(() => {
            clearTimeout(t);
            t = setTimeout(() => {
                if (Math.abs(el.clientWidth - w) > 40 || Math.abs(el.clientHeight - h) > 40) {
                    w = el.clientWidth;
                    h = el.clientHeight;
                    setVersion((v) => v + 1);
                }
            }, 350);
        });
        ro.observe(el);
        return () => {
            clearTimeout(t);
            ro.disconnect();
        };
    }, []);

    useEffect(() => {
        const el = sceneRef.current;
        const cardEl = cardRef.current;
        const rope = ropeRef.current;
        if (!el || !cardEl) return;

        const width = el.clientWidth;
        const height = el.clientHeight;
        if (width < 300 || height < 320) return; // never build in a collapsed layout

        const { Engine, World, Bodies, Body, Constraint, Mouse, MouseConstraint } = Matter;

        const engine = Engine.create();
        engine.gravity.y = 1;
        engine.positionIterations = 14;
        engine.constraintIterations = 6;
        const world = engine.world;

        const anchor = { x: width / 2, y: 6 };
        const restLen = DROP + CARD_H / 2; // anchor -> card centre at rest

        // ---- The ID card: a point mass (infinite inertia => never rotates) ----
        const card = Bodies.rectangle(anchor.x, anchor.y + restLen, CARD_W, CARD_H, {
            frictionAir: 0.055,
            density: 0.002,
            inertia: Infinity,
        });

        // ---- The lanyard: one near-rigid, well-damped cord (anchor -> card
        // centre). Rigid + point-mass => a clean pendulum with a single stable
        // rest state; it can't orbit, bungee or drift. ----
        const cord = Constraint.create({
            pointA: anchor,
            bodyB: card,
            pointB: { x: 0, y: 0 },
            length: restLen,
            stiffness: 0.95,
            damping: 0.14,
        });

        // ---- Far-off walls: only catch a pathological fling ----
        const wallOpts = { isStatic: true };
        const walls = [
            Bodies.rectangle(-80, height / 2, 60, height * 2, wallOpts),
            Bodies.rectangle(width + 80, height / 2, 60, height * 2, wallOpts),
            Bodies.rectangle(width / 2, height + 180, width * 2, 120, wallOpts),
        ];

        World.add(world, [card, cord, ...walls]);

        // ---- Mouse drag / throw (desktop) ----
        const mouse = Mouse.create(el);
        mouse.pixelRatio = window.devicePixelRatio || 1;
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse,
            constraint: { stiffness: 0.2, damping: 0.25, render: { visible: false } },
        });
        World.add(world, mouseConstraint);

        // Don't hijack page scrolling.
        el.removeEventListener('wheel', mouse.mousewheel);
        el.removeEventListener('DOMMouseScroll', mouse.mousewheel);
        // Disable touch dragging so mobile users can still scroll past the section.
        el.removeEventListener('touchstart', mouse.mousedown);
        el.removeEventListener('touchmove', mouse.mousemove);
        el.removeEventListener('touchend', mouse.mouseup);

        // Safety: a pointer released or lost outside the scene never reaches
        // Matter's element-bound mouseup, which would leave the card stuck to a
        // phantom cursor and whip it around. Force-release on every global
        // pointer-up / cancel / focus loss.
        const releaseDrag = () => {
            mouseConstraint.constraint.bodyB = null;
            mouseConstraint.body = null;
            mouse.button = -1;
        };
        window.addEventListener('mouseup', releaseDrag);
        window.addEventListener('pointerup', releaseDrag);
        window.addEventListener('pointercancel', releaseDrag);
        window.addEventListener('blur', releaseDrag);
        document.addEventListener('visibilitychange', releaseDrag);

        // ---- Gentle nudge so it swings in on load (position only) ----
        Body.setPosition(card, { x: card.position.x + 16, y: card.position.y });

        let mounted = true;
        let shownAngle = 0; // eased visual tilt
        const step = () => {
            if (!mounted) return;
            // While the tab is hidden rAF is throttled to a few fps; skip the
            // sim so it doesn't crawl through its transient in slow motion and
            // just resumes cleanly when the user comes back.
            if (document.hidden) {
                rafRef.current = requestAnimationFrame(step);
                return;
            }

            // If a grab is somehow still active without the button held, drop it.
            if (mouseConstraint.body && mouse.button !== 0) {
                mouseConstraint.constraint.bodyB = null;
                mouseConstraint.body = null;
            }

            Engine.update(engine, 1000 / 60);

            // hard safety clamp: a point mass on this cord should never move fast
            if (Body.getSpeed(card) > 45) {
                Body.setSpeed(card, 12);
            }

            const cx = card.position.x;
            const cy = card.position.y;
            // Tilt follows the cord direction (anchor -> card); slight easing/overshoot
            // gives the card a bit of lag as it swings.
            const targetAngle = Math.atan2(cx - anchor.x, cy - anchor.y) * 1.15;
            shownAngle += (targetAngle - shownAngle) * 0.35;
            const cos = Math.cos(shownAngle);
            const sin = Math.sin(shownAngle);

            cardEl.style.transform =
                `translate(${(cx - CARD_W / 2).toFixed(2)}px, ${(cy - CARD_H / 2).toFixed(2)}px) rotate(${shownAngle.toFixed(4)}rad)`;

            if (rope) {
                const ly = -CARD_H / 2;
                const lX = cx + -TAB * cos - ly * sin;
                const lY = cy + -TAB * sin + ly * cos;
                const rX = cx + TAB * cos - ly * sin;
                const rY = cy + TAB * sin + ly * cos;
                rope.setAttribute(
                    'points',
                    `${lX.toFixed(1)},${lY.toFixed(1)} ${anchor.x},${anchor.y} ${rX.toFixed(1)},${rY.toFixed(1)}`
                );
            }
            rafRef.current = requestAnimationFrame(step);
        };
        step();

        return () => {
            mounted = false;
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('mouseup', releaseDrag);
            window.removeEventListener('pointerup', releaseDrag);
            window.removeEventListener('pointercancel', releaseDrag);
            window.removeEventListener('blur', releaseDrag);
            document.removeEventListener('visibilitychange', releaseDrag);
            World.clear(world, false);
            Engine.clear(engine);
        };
    }, [version, photo]);

    return (
        <div
            ref={sceneRef}
            className="relative z-20 h-full w-full select-none cursor-grab active:cursor-grabbing"
        >
            {/* Lanyard cord — flat dark-grey strap */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
                <polyline
                    ref={ropeRef}
                    points=""
                    fill="none"
                    stroke="#444444"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Anchor pin */}
            <div className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#444444]" />

            {/* The card (synced to the physics body every frame) */}
            <div
                ref={cardRef}
                className="pointer-events-none absolute left-0 top-0 origin-center will-change-transform"
                style={{ width: CARD_W, height: CARD_H }}
            >
                {/* Badge clip bridging the cord and the card */}
                <div className="absolute left-1/2 -top-2 z-10 h-5 w-14 -translate-x-1/2 rounded-[3px] border border-[#555] bg-[#3a3a3a]">
                    <div className="absolute left-1/2 top-1/2 h-1.5 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/70" />
                </div>

                <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-line bg-background">
                    <div className="flex h-12 items-center justify-center bg-accent-blue">
                        <span className="font-mono text-xs tracking-[0.28em] text-white">BMSIT&amp;M</span>
                    </div>

                    <div className="flex flex-1 flex-col items-center gap-3 p-5">
                        <img
                            src={photo}
                            alt={name}
                            draggable="false"
                            className="h-44 w-44 rounded-lg border border-line object-cover"
                        />
                        <div className="text-center">
                            <p className="text-lg font-bold leading-tight text-primary">{name}</p>
                            <p className="text-xs tracking-wide text-accent-blue">{role}</p>
                        </div>
                        <div className="mt-auto flex w-full justify-between border-t border-line pt-2.5 font-mono text-[10px] text-secondary">
                            <span>ID&nbsp;&middot;&nbsp;2026</span>
                            <span>BANGALORE</span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="pointer-events-none absolute bottom-3 right-3 font-mono text-[10px] tracking-[0.3em] text-[#666]">
                DRAG&nbsp;ME
            </p>
        </div>
    );
};

export default LanyardBadge;
