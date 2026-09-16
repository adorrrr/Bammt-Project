import { useEffect } from 'react';

const SITE_URL = 'https://gangchill.com';
const SITE_NAME = 'Gangchill (গাংচিল)';
const DEFAULT_OG_IMAGE = `${SITE_URL}/hero-boats.jpg`;

interface SeoProps {
  title: string;
  description: string;
  /** Path or absolute URL, e.g. "/blog/my-article" */
  path: string;
  image?: string;
  ogType?: 'website' | 'article';
  keywords?: string[];
  /** JSON-LD structured data object(s) */
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Lightweight per-page SEO manager: updates document title, meta tags,
 * canonical link and JSON-LD structured data on mount/route change.
 * Avoids adding a react-helmet dependency to the project.
 */
export const Seo: React.FC<SeoProps> = ({
  title,
  description,
  path,
  image,
  ogType = 'website',
  keywords,
  structuredData,
  noindex = false,
}) => {
  useEffect(() => {
    const canonical = path.startsWith('http') ? path : `${SITE_URL}${path}`;
    const ogImage = image
      ? image.startsWith('http')
        ? image
        : `${SITE_URL}${image}`
      : DEFAULT_OG_IMAGE;

    document.title = title;
    document.documentElement.lang = 'bn';

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    if (keywords && keywords.length > 0) {
      upsertMeta('name', 'keywords', keywords.join(', '));
    }

    upsertLink('canonical', canonical);

    upsertMeta('property', 'og:type', ogType);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:locale', 'bn_BD');
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:image:alt', title);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);

    const scriptId = 'seo-structured-data';
    document.getElementById(scriptId)?.remove();
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = scriptId;
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      document.getElementById(scriptId)?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, image, ogType, noindex, JSON.stringify(keywords), JSON.stringify(structuredData)]);

  return null;
};

export const SEO_SITE_URL = SITE_URL;
export const SEO_SITE_NAME = SITE_NAME;
