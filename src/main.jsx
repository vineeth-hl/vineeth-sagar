import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './routes';
import './index.css';

// Per-route <title> / <meta description> for the pre-rendered HTML is handled at
// build time in vite.config.js (ssgOptions.onPageRendered). Client-side route
// changes are kept in sync by the useTitle() hook in the blog pages.
export const createRoot = ViteReactSSG({ routes });
