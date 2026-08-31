import React from 'react';

/**
 * Subtle, low-opacity animated background for a section. Sits behind the
 * content (`z-0`; content wrappers are `relative z-10`), ignores pointer
 * events, and is disabled under `prefers-reduced-motion` (see index.css).
 *
 * variant: 'grid' | 'orbs' | 'aurora' | 'dots'
 */
export default function SectionFX({ variant = 'grid', className = '' }) {
    return (
        <div className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`} aria-hidden="true">
            {variant === 'grid' && (
                <div
                    className="fx-anim absolute -inset-24 opacity-[0.045]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
                        backgroundSize: '58px 58px',
                        animation: 'fx-drift 26s linear infinite alternate'
                    }}
                />
            )}

            {variant === 'orbs' && (
                <>
                    <div
                        className="fx-anim absolute left-[6%] top-[10%] h-72 w-72 rounded-full opacity-[0.10] blur-3xl"
                        style={{
                            background: 'radial-gradient(circle, rgb(var(--accent)) 0%, transparent 70%)',
                            animation: 'fx-float-a 19s ease-in-out infinite'
                        }}
                    />
                    <div
                        className="fx-anim absolute bottom-[8%] right-[5%] h-80 w-80 rounded-full opacity-[0.08] blur-3xl"
                        style={{
                            background: 'radial-gradient(circle, #6d5ef6 0%, transparent 70%)',
                            animation: 'fx-float-b 23s ease-in-out infinite'
                        }}
                    />
                </>
            )}

            {variant === 'aurora' && (
                <div
                    className="fx-anim absolute left-1/2 top-1/2 h-[150vmax] w-[150vmax] opacity-[0.05] blur-[90px]"
                    style={{
                        transform: 'translate(-50%, -50%)',
                        background:
                            'conic-gradient(from 0deg, transparent 0%, rgb(var(--accent) / 0.5) 18%, transparent 42%, #6d5ef6 62%, transparent 84%)',
                        animation: 'fx-spin-slow 46s linear infinite'
                    }}
                />
            )}

            {variant === 'dots' && (
                <div
                    className="fx-anim absolute -inset-16 opacity-[0.06]"
                    style={{
                        backgroundImage: 'radial-gradient(rgba(255,255,255,0.75) 1.2px, transparent 1.2px)',
                        backgroundSize: '42px 42px',
                        animation: 'fx-drift 34s linear infinite alternate'
                    }}
                />
            )}
        </div>
    );
}
