import { useEffect } from 'react';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

const BASE_URL = 'https://www.successtheological.edu';
const DEFAULT_IMAGE = `${BASE_URL}/images/stsc logo.jpeg`;
const SITE_NAME = 'SUCCESS THEOLOGICAL SEMINARY AND COLLEGE';

/**
 * useSEO — Dynamic per-page SEO hook
 *
 * Sets document title and updates meta tags for each page.
 * Works with SSR-unaware Vite SPA (updates DOM directly).
 */
export function useSEO(config: SEOConfig) {
  useEffect(() => {
    const fullTitle = `${config.title} | STSC Ghana`;
    const image = config.ogImage || DEFAULT_IMAGE;
    const canonical = config.canonical || BASE_URL;

    // Title
    document.title = fullTitle;

    // Helper to set/create a meta tag
    const setMeta = (selector: string, attr: string, content: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        const [attrName, ...rest] = selector.replace('meta[', '').replace(']', '').split('="');
        el.setAttribute(attrName, rest.join('="').replace('"', ''));
        document.head.appendChild(el);
      }
      el.setAttribute(attr, content);
    };

    setMeta('meta[name="title"]', 'content', fullTitle);
    setMeta('meta[name="description"]', 'content', config.description);
    if (config.keywords) setMeta('meta[name="keywords"]', 'content', config.keywords);

    // Open Graph
    setMeta('meta[property="og:title"]', 'content', `${config.title} — ${SITE_NAME}`);
    setMeta('meta[property="og:description"]', 'content', config.description);
    setMeta('meta[property="og:image"]', 'content', image);
    setMeta('meta[property="og:url"]', 'content', canonical);

    // Twitter Card
    setMeta('meta[name="twitter:title"]', 'content', `${config.title} — ${SITE_NAME}`);
    setMeta('meta[name="twitter:description"]', 'content', config.description);
    setMeta('meta[name="twitter:image"]', 'content', image);

    // Canonical
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonical);
  }, [config.title, config.description, config.keywords, config.ogImage, config.canonical]);
}

// ─── Per-page presets ───────────────────────────────────────────────────────

export const SEO = {
  home: {
    title: 'Home',
    description: 'SUCCESS THEOLOGICAL SEMINARY AND COLLEGE (STSC) — Raising spotless leaders for global impact. Ghana\'s leading biblical institution with 7 campuses and 42 programmes.',
    keywords: 'STSC Ghana, Success Theological Seminary, biblical education Ghana, theology college Ghana, Kasoa seminary',
    canonical: `${BASE_URL}/`,
  },
  about: {
    title: 'About Us',
    description: 'Founded in 2013 with 14 students, STSC now operates 7 campuses across Ghana — Kasoa-Nyanyano, Teshie, Kumasi, Ho, Hohoe, Techiman and Bolgatanga. Learn our mission, vision and values.',
    keywords: 'about STSC, Success Theological Seminary history, Ghana seminary campuses, biblical leadership Ghana',
    canonical: `${BASE_URL}/about`,
  },
  courses: {
    title: 'Academic Programs',
    description: 'Explore 42 accredited programmes across 7 departments: Theology, Biblical Studies, Apostolic Ministry, Prophetic College, Counseling, Music and Mission. Certificate to Doctorate levels.',
    keywords: 'theology degree Ghana, biblical studies diploma, apostolic ministry certificate, prophetic college, counseling courses Ghana, Christian music programme',
    canonical: `${BASE_URL}/courses`,
  },
  contact: {
    title: 'Contact Us',
    description: 'Get in touch with SUCCESS THEOLOGICAL SEMINARY AND COLLEGE. Call +233 257 077 972, email info@successtheological.edu, or visit any of our 7 campuses across Ghana.',
    keywords: 'contact STSC Ghana, Success Theological Seminary contact, seminary admissions Ghana',
    canonical: `${BASE_URL}/contact`,
  },
  apply: {
    title: 'Apply for Admission',
    description: 'Begin your journey at SUCCESS THEOLOGICAL SEMINARY AND COLLEGE. Apply online for our Certificate, Diploma, Degree, Masters or Doctorate programmes. Applications sent directly to info@successtheological.edu.',
    keywords: 'apply STSC, seminary admission Ghana, theological college application, biblical studies enrollment',
    canonical: `${BASE_URL}/apply`,
  },
};
