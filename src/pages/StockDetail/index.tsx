import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '../../components/common/Container';
import { BackButton } from '../../components/common/BackButton';
import { CorporateRequirementModal } from '../../components/forms/CorporateRequirementModal';
import { stockService } from '../../services/stockService';
import { Stock } from '../../types/stock';
import { formatTaka, toBanglaDigits } from '../../utils/formatters';

export const StockDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [stock, setStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      stockService.getStockBySlug(slug).then((res) => {
        setStock(res);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <Container className="py-20 text-center font-mono text-sm text-gangchill-ink/50">
        মাছের স্টকের বিবরণ লোড হচ্ছে...
      </Container>
    );
  }

  if (!stock) {
    return (
      <Container className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-serifBangla text-gangchill-ink">
          পণ্যটি খুঁজে পাওয়া যায়নি
        </h2>
        <Link to="/buy" className="text-sm font-semibold text-gangchill-green underline">
          স্টক বোর্ডে ফিরে যান
        </Link>
      </Container>
    );
  }

  const isLive = stock.status === 'live';

  return (
    <div className="bg-gangchill-canvas text-gangchill-ink min-h-screen py-8 sm:py-16">
      <Container size="md">
        {/* Back Link */}
        <div className="mb-6">
          <BackButton to="/buy" label="বর্তমান স্টকে ফিরুন" />
        </div>

        {/* 1. Large Un-boxed Photography */}
        <div className="w-full aspect-16/10 sm:aspect-21/10 overflow-hidden bg-gangchill-surface border border-gangchill-ink/10 mb-8 sm:mb-12">
          <img
            src={stock.images[0]}
            alt={stock.banglaName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 2. Editorial Story & Title */}
        <div className="space-y-6 max-w-3xl">
          <div className="text-xs font-bangla font-semibold text-gangchill-earth tracking-wide">
            {isLive ? '✓ বর্তমানে সংগ্রহযোগ্য' : '⏳ আসন্ন আহরণ'} · {stock.category}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-serifBangla text-gangchill-green-deep leading-tight">
            {stock.banglaName}
          </h1>

          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serifBangla text-gangchill-ink">
            {toBanglaDigits(stock.quantity)} <span className="text-lg sm:text-xl font-normal text-gangchill-ink/70">{stock.unit}</span>
          </div>

          <p className="text-sm sm:text-lg text-gangchill-ink/80 leading-relaxed font-light border-l-2 border-gangchill-green pl-3 sm:pl-4">
            {stock.description}
          </p>

          {/* 3. Human Arranged Facts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-5 sm:pt-6 border-t border-b border-gangchill-ink/12 py-6 sm:py-8 my-6 sm:my-8 text-sm">
            <div>
              <span className="text-xs text-gangchill-ink/50 block mb-1">উৎস ঘাট / মোহনা / ঘের</span>
              <strong className="text-base text-gangchill-ink">{stock.location} ({stock.district})</strong>
              {stock.originDetails?.unionOrVillage && (
                <div className="text-xs text-gangchill-ink/70 mt-0.5">{stock.originDetails.unionOrVillage}</div>
              )}
            </div>

            <div>
              <span className="text-xs text-gangchill-ink/50 block mb-1">আহরণের সময় / পাওয়ার তারিখ</span>
              <strong className="text-base text-gangchill-ink">{stock.harvestDate || stock.availabilityDate || 'আজকের তাজা সংগ্রহ'}</strong>
            </div>

            <div>
              <span className="text-xs text-gangchill-ink/50 block mb-1">Size ও কোয়ালিটি গ্রেড</span>
              <strong className="text-base text-gangchill-ink">{stock.grade || 'স্ট্যান্ডার্ড এক্সপোর্ট গ্রেড'}</strong>
            </div>

            <div>
              <span className="text-xs text-gangchill-ink/50 block mb-1">সংরক্ষণ ও প্যাকেজিং</span>
              <strong className="text-base text-gangchill-ink">{stock.packaging || 'ইনসুলেটেড আইস বক্স'}</strong>
            </div>

            <div>
              <span className="text-xs text-gangchill-ink/50 block mb-1">ন্যূনতম ক্রয়সীমা</span>
              <strong className="text-base text-gangchill-ink">{stock.minimumOrder ? `${toBanglaDigits(stock.minimumOrder)} কেজি/টন` : 'আলোচনা সাপেক্ষে'}</strong>
            </div>

            <div>
              <span className="text-xs text-gangchill-ink/50 block mb-1">দর ও পেমেন্ট স্ট্যাটাস</span>
              <strong className="text-base text-gangchill-green">
                {stock.price ? `${formatTaka(stock.price)} / কেজি` : 'আলোচনা সাপেক্ষে'}
              </strong>
            </div>

            {stock.logistics?.estimatedDeliveryDays && (
              <div className="sm:col-span-2">
                <span className="text-xs text-gangchill-ink/50 block mb-1">ডেলিভারি উইন্ডো ও কোল্ডচেইন ট্রান্সপোর্ট</span>
                <strong className="text-base text-gangchill-ink">{stock.logistics.estimatedDeliveryDays}</strong>
              </div>
            )}
          </div>

          {/* 4. Action */}
          <div className="pt-4">
            <button
              onClick={() => setIsRequirementModalOpen(true)}
              className="w-full sm:w-auto px-5 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gangchill-green text-white font-bold text-sm sm:text-base hover:bg-gangchill-green-deep active:scale-95 transition-all inline-flex items-center justify-center gap-3 shadow-sm cursor-pointer"
            >
              <span>এই স্টকটি প্রয়োজন</span>
              <span>→</span>
            </button>
            <p className="text-xs text-gangchill-ink/60 mt-2">
              আপনার চাহিদা জমা দিলে Gangchill সোর্সিং টিম সরাসরি ঘাট ও আড়তের কোটেশন নিয়ে যোগাযোগ করবে।
            </p>
          </div>
        </div>
      </Container>

      <CorporateRequirementModal
        isOpen={isRequirementModalOpen}
        onClose={() => setIsRequirementModalOpen(false)}
        prefilledStock={stock}
      />
    </div>
  );
};
