import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // eslint-disable-next-line no-console
        console.error('Uncaught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#0D0D0D] px-6 text-center text-white/70">
                    <h1 className="text-lg font-semibold text-white">Something went wrong.</h1>
                    <p className="max-w-md text-sm">{this.state.error?.toString()}</p>
                    <a href="/" className="mt-2 text-sm text-accent-blue underline">
                        Back to home
                    </a>
                </div>
            );
        }
        return this.props.children;
    }
}

function ScrollToTop() {
    const { pathname } = useLocation();
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

export default function RootLayout() {
    return (
        <ErrorBoundary>
            <ScrollToTop />
            <Outlet />
        </ErrorBoundary>
    );
}
