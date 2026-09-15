import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import { Container } from '../../components/common/Container';
import { BackButton } from '../../components/common/BackButton';
import { BlogCard } from '../../components/blog/BlogCard';
import { ArticleContent } from '../../components/blog/ArticleContent';
import { Seo, SEO_SITE_URL } from '../../components/seo/Seo';
import { blogService } from '../../services/blogService';
import { BlogPost } from '../../types/blog';
import { formatBanglaDate } from '../../utils/formatters';

export const BlogArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    blogService.getPostBySlug(slug).then((found) => {
      setPost(found);
      setLoading(false);
      if (found) {
        blogService.getRelatedPosts(found.slug, 3).then(setRelatedPosts);
      }
    });
  }, [slug]);

  if (loading) {
    return (
      <Container className="py-20 text-center font-mono text-sm text-gangchill-ink/50">
        আর্টিকেল লোড হচ্ছে...
      </Container>
    );
  }

  if (!post) {
    return (
      <>
        <Seo
          title="আর্টিকেলটি খুঁজে পাওয়া যায়নি | Gangchill (গাংচিল)"
          description="আপনি যে ব্লগ আর্টিকেলটি খুঁজছেন তা পাওয়া যায়নি বা সরিয়ে ফেলা হয়েছে।"
          path={`/blog/${slug ?? ''}`}
          noindex
        />
        <Container size="sm" className="py-20 text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold font-serifBangla text-gangchill-ink">
            আর্টিকেলটি খুঁজে পাওয়া যায়নি
          </h1>
          <p className="text-sm text-gangchill-ink-muted max-w-sm mx-auto font-light">
            আপনি যে আর্টিকেলটি খুঁজছেন তা স্থানান্তরিত হয়েছে অথবা লিংকটি সঠিক নয়।
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gangchill-blue underline"
          >
            সকল ব্লগ আর্টিকেলে ফিরে যান
          </Link>
        </Container>
      </>
    );
  }

  const canonicalPath = `/blog/${post.slug}`;
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.seoDescription,
      image: `${SEO_SITE_URL}${post.featuredImage}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      author: { '@type': 'Organization', name: post.author },
      publisher: {
        '@type': 'Organization',
        name: 'Gangchill (গাংচিল)',
        logo: { '@type': 'ImageObject', url: `${SEO_SITE_URL}/favicon.svg` },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SEO_SITE_URL}${canonicalPath}` },
      keywords: post.keywords?.join(', '),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'হোম', item: SEO_SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'ব্লগ', item: `${SEO_SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: `${SEO_SITE_URL}${canonicalPath}` },
      ],
    },
  ];

  return (
    <div className="bg-gangchill-canvas text-gangchill-ink min-h-screen py-8 sm:py-14">
      <Seo
        title={post.seoTitle}
        description={post.seoDescription}
        path={canonicalPath}
        image={post.featuredImage}
        ogType="article"
        keywords={post.keywords}
        structuredData={structuredData}
      />

      <Container size="md">
        <div className="mb-6 flex items-center justify-between gap-4">
          <BackButton to="/blog" label="ব্লগে ফিরে যান" />

          {/* Breadcrumb */}
          <nav aria-label="ব্রেডক্রাম্ব" className="hidden sm:flex items-center gap-1.5 text-xs text-gangchill-ink-muted">
            <Link to="/" className="hover:text-gangchill-blue transition-colors">হোম</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/blog" className="hover:text-gangchill-blue transition-colors">ব্লগ</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gangchill-ink font-medium truncate max-w-[220px]">{post.title}</span>
          </nav>
        </div>

        <article>
          <header className="max-w-3xl space-y-4 mb-8">
            <span className="inline-block text-xs font-semibold text-gangchill-cyan-deep bg-gangchill-cyan/10 border border-gangchill-cyan/20 px-2.5 py-1 rounded-full">
              {post.category}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-serifBangla text-gangchill-ink leading-tight">
              {post.title}
            </h1>
            <p className="text-sm sm:text-lg text-gangchill-ink/75 leading-relaxed font-light">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gangchill-ink-muted pt-2">
              <span className="font-semibold text-gangchill-ink">{post.author}</span>
              <span className="w-1 h-1 rounded-full bg-gangchill-ink/30" />
              <time dateTime={post.publishedAt}>{formatBanglaDate(post.publishedAt)}</time>
              <span className="w-1 h-1 rounded-full bg-gangchill-ink/30" />
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime}
              </span>
            </div>
          </header>

          <div className="w-full aspect-16/9 sm:aspect-21/9 overflow-hidden rounded-2xl bg-gangchill-navy/5 border border-gangchill-ink/10 mb-8 sm:mb-10">
            <img
              src={post.featuredImage}
              alt={post.imageAlt}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="max-w-3xl">
            <ArticleContent blocks={post.content} />
          </div>
        </article>

        <div className="max-w-3xl mt-10 pt-6 border-t border-gangchill-ink/8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gangchill-blue hover:text-gangchill-blue-deep transition-colors">
            ← সকল ব্লগ আর্টিকেলে ফিরে যান
          </Link>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="mt-14 sm:mt-20 pt-10 border-t border-gangchill-ink/10" aria-label="সম্পর্কিত আর্টিকেল">
            <h2 className="text-xl sm:text-2xl font-bold font-serifBangla text-gangchill-ink mb-6 sm:mb-8">
              সম্পর্কিত আর্টিকেল
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedPosts.map((related) => (
                <BlogCard key={related.slug} post={related} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
};

export default BlogArticlePage;
