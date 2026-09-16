import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { BlogPost } from '../../types/blog';
import { formatBanglaDate } from '../../utils/formatters';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white/85 backdrop-blur-xl border border-white/90 shadow-glass hover:shadow-glass-glow hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative w-full aspect-16/10 overflow-hidden bg-gangchill-navy/5">
        <img
          src={post.featuredImage}
          alt={post.imageAlt}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-gangchill-navy/80 text-white backdrop-blur-md">
          {post.category}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="text-lg font-bold font-serifBangla text-gangchill-ink leading-snug group-hover:text-gangchill-blue transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-gangchill-ink-muted leading-relaxed font-light line-clamp-3">
          {post.excerpt}
        </p>

        <div className="mt-auto pt-3 border-t border-gangchill-ink/8 flex items-center justify-between text-xs text-gangchill-ink-muted">
          <div className="flex items-center gap-2 min-w-0">
            <time dateTime={post.publishedAt} className="truncate">
              {formatBanglaDate(post.publishedAt)}
            </time>
            <span className="w-1 h-1 rounded-full bg-gangchill-ink/30 shrink-0" />
            <span className="inline-flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3" />
              {post.readingTime}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 font-semibold text-gangchill-blue shrink-0 group-hover:gap-1.5 transition-all">
            পড়ুন
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};
