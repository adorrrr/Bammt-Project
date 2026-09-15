import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Star,
  Filter
} from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { BlogPost } from '../../../types/blog';
import { ConfirmModal } from '../../../components/admin/ConfirmModal';

export const AdminBlogPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteTargetSlug, setDeleteTargetSlug] = useState<string | null>(null);

  const loadData = () => {
    setPosts(adminService.getBlogPosts());
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = ['all', ...Array.from(new Set(posts.map((p) => p.category)))];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleToggleFeatured = (slug: string, current: boolean | undefined) => {
    adminService.updateBlogPost(slug, { featured: !current });
    loadData();
  };

  const handleDeletePost = () => {
    if (deleteTargetSlug) {
      adminService.deleteBlogPost(deleteTargetSlug);
      setDeleteTargetSlug(null);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serifBangla flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-blue-600" />
            ব্লগ ও নলেজবেস আর্টিকেল
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            মাছের জাত, কোল্ড চেইন সংরক্ষণ ও বাজার বিষয়ক আর্টিকেল ব্যবস্থাপনা
          </p>
        </div>

        <Link
          to="/admin/blog/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          নতুন আর্টিকেল লিখুন
        </Link>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">প্রকাশিত আর্টিকেল</span>
          <p className="text-xl font-bold text-slate-900 mt-1 font-bangla">{posts.length} টি</p>
          <span className="text-[11px] text-slate-400">সক্রিয় আর্টিকেল</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">ফিচার্ড আর্টিকেল</span>
          <p className="text-xl font-bold text-amber-600 mt-1 font-bangla">
            {posts.filter((p) => p.featured).length} টি
          </p>
          <span className="text-[11px] text-slate-400">হোমপেজে প্রদর্শিত</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">ক্যাটাগরি সংখ্যা</span>
          <p className="text-xl font-bold text-blue-600 mt-1 font-bangla">{categories.length - 1} টি</p>
          <span className="text-[11px] text-slate-400">বিষয়ভিত্তিক ক্যাটাগরি</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">এসইও রেটিং</span>
          <p className="text-xl font-bold text-emerald-700 mt-1 font-bangla">১০০% অপ্টিমাইজড</p>
          <span className="text-[11px] text-slate-400">সার্চ ইঞ্জিনের জন্য প্রস্তুত</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="আর্টিকেলের শিরোনাম, লেখক বা বিষয় দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'সকল ক্যাটাগরি' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPosts.map((post) => (
          <div
            key={post.slug}
            className="rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col overflow-hidden group shadow-xs"
          >
            {/* Image banner */}
            <div className="relative h-44 w-full bg-slate-100 overflow-hidden shrink-0">
              <img
                src={post.featuredImage}
                alt={post.imageAlt || post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/10" />

              {/* Category chip */}
              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/90 text-slate-800 backdrop-blur-xs shadow-xs border border-slate-200/60">
                {post.category}
              </span>

              {/* Featured toggle button */}
              <button
                onClick={() => handleToggleFeatured(post.slug, post.featured)}
                title={post.featured ? 'ফিচার্ড লিস্ট থেকে বাদ দিন' : 'ফিচার্ড হিসেবে চিহ্নিত করুন'}
                className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
                  post.featured
                    ? 'bg-amber-500 text-white font-bold shadow-xs'
                    : 'bg-white/80 text-slate-600 hover:text-slate-900 shadow-xs'
                }`}
              >
                <Star className="w-3.5 h-3.5" fill={post.featured ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Content info */}
            <div className="p-5 flex-1 space-y-3">
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {post.publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {post.readingTime}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 font-serifBangla group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2">{post.excerpt}</p>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                <span>লেখক: <span className="text-slate-800 font-medium">{post.author}</span></span>
                <span className="font-mono text-[10px] text-slate-400">/{post.slug}</span>
              </div>
            </div>

            {/* Footer actions */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
              <Link
                to={`/blog/${post.slug}`}
                target="_blank"
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
              >
                পাবলিক ভিউ
                <ExternalLink className="w-3 h-3" />
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/admin/blog/${post.slug}/edit`)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  title="আর্টিকেল সম্পাদনা করুন"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTargetSlug(post.slug)}
                  className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="আর্টিকেল মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-medium text-slate-600">কোনো আর্টিকেল পাওয়া যায়নি</p>
            <Link
              to="/admin/blog/new"
              className="mt-3 text-xs text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
            >
              <Plus className="w-3 h-3" />
              নতুন আর্টিকেল লিখতে ক্লিক করুন
            </Link>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={!!deleteTargetSlug}
        title="ব্লগ আর্টিকেল মুছে ফেলতে চান?"
        message="এই আর্টিকেলটি ওয়েবসাইট থেকে সম্পূর্ণভাবে অপসারণ করা হবে। এই পদক্ষেপটি ফিরিয়ে আনা সম্ভব নয়।"
        confirmLabel="হ্যাঁ, মুছে ফেলুন"
        variant="danger"
        onConfirm={handleDeletePost}
        onClose={() => setDeleteTargetSlug(null)}
      />
    </div>
  );
};
