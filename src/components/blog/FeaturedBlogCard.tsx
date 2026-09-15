import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { BlogPost } from '../../types/blog';
import { formatBanglaDate } from '../../utils/formatters';

interface FeaturedBlogCardProps {
  post: BlogPost;
}

export const FeaturedBlogCard: React.FC<FeaturedBlogCardProps> = ({ post }) => {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl sm:rounded-3xl overflow-hidden bg-white/90 backdrop-blur-2xl border border-white/90 shadow-glass-lg hover:shadow-glass-glow transition-all duration-300"
    >
      <div className="relative w-full h-64 sm:h-80 lg:h-full overflow-hidden bg-gangchill-navy/5">
        <img
          src={post.featuredImage}
          alt={post.imageAlt}
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gangchill-navy/40 via-transparent to-transparent lg:hidden" />
      </div>

      <div className="relative flex flex-col justify-center gap-4 p-6 sm:p-10">
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-white bg-gangchill-blue px-3 py-1 rounded-full">
            ফিচারড আর্টিকেল
          </span>
          <span className="text-xs font-semibold text-gangchill-cyan-deep bg-gangchill-cyan/10 border border-gangchill-cyan/20 px-2.5 py-1 rounded-full">
            {post.category}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serifBangla text-gangchill-ink leading-tight group-hover:text-gangchill-blue transition-colors">
          {post.title}
        </h2>

        <p className="text-sm sm:text-base text-gangchill-ink/75 leading-relaxed font-light">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-3 text-xs text-gangchill-ink-muted pt-2">
          <time dateTime={post.publishedAt}>{formatBanglaDate(post.publishedAt)}</time>
          <span className="w-1 h-1 rounded-full bg-gangchill-ink/30" />
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readingTime}
          </span>
          <span className="w-1 h-1 rounded-full bg-gangchill-ink/30" />
          <span>{post.author}</span>
        </div>

        <span className="inline-flex items-center gap-2 font-bold text-gangchill-blue mt-2 group-hover:gap-3 transition-all">
          সম্পূর্ণ আর্টিকেলটি পড়ুন
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
};
