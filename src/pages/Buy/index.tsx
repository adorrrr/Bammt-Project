import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container } from '../../components/common/Container';
import { CorporateRequirementModal } from '../../components/forms/CorporateRequirementModal';
import { stockService } from '../../services/stockService';
import { WholesaleStockCard } from '../../components/stock/WholesaleStockCard';
import { Stock, StockStatus } from '../../types/stock';
import { toBanglaDigits } from '../../utils/formatters';
import { ClipboardList, Sparkles } from 'lucide-react';

export const BuyPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab');
  const activeTab: StockStatus = rawTab === 'upcoming' ? 'upcoming' : 'live';

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false);
  const [liveCount, setLiveCount] = useState<number>(0);
  const [upcomingCount, setUpcomingCount] = useState<number>(0);

  useEffect(() => {
    if (searchParams.get('action') === 'demand') {
      setIsRequirementModalOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    stockService.getStocks().then((all) => {
      setLiveCount(all.filter((s) => s.status === 'live').length);
      setUpcomingCount(all.filter((s) => s.status === 'upcoming').length);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    stockService.getStocks({ status: activeTab }).then((res) => {
      setStocks(res);
      setLoading(false);
    });
  }, [activeTab]);

  const handleTabChange = (tab: StockStatus) => {
    if (tab === 'live') {
      searchParams.delete('tab');
    } else {
      searchParams.set('tab', tab);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-gangchill-canvas text-gangchill-ink min-h-screen py-10 sm:py-16">
      <Container>
        {/* Wholesale Fish Stock Board Masthead */}
        <div className="border-b border-gangchill-ink/12 pb-6 mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bangla font-semibold text-gangchill-blue bg-gangchill-blue/10 px-3 py-1 rounded-full border border-gangchill-blue/20 tracking-wide mb-2">
            <span className="w-2 h-2 rounded-full bg-gangchill-blue animate-pulse" />
            <span>Gangchill হোলসেল ফিশ স্টক বোর্ড</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serifBangla text-gangchill-ink tracking-tight mb-2">
                আজ কী পাওয়া যাচ্ছে?
              </h1>
              <p className="text-sm sm:text-base text-gangchill-ink/75 max-w-2xl font-light">
                সুপারমার্কেট, সিফুড প্রসেসিং কারখানা, হোটেল ও পাইকারি আড়তদারদের জন্য সরাসরি ঘাট ও ঘের থেকে সংগৃহীত তাজা মাছের বাল্ক স্টক।
              </p>
            </div>
          </div>

          {/* Clean 2-Tab Bar with Top 'চাহিদা জানান' CTA Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 border-t border-gangchill-ink/10 pt-4">
            {/* Tabs: 'আজকের প্রস্তুত স্টক' & 'সামনে কী আসছে? (আসন্ন আহরণ)' */}
            <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium overflow-x-auto scrollbar-hide pb-1 max-w-full">
              <button
                type="button"
                onClick={() => handleTabChange('live')}
                className={`relative pb-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  activeTab === 'live'
                    ? 'text-gangchill-blue font-bold border-b-2 border-gangchill-blue'
                    : 'text-gangchill-ink/60 hover:text-gangchill-ink'
                }`}
              >
                <span>আজকের প্রস্তুত স্টক</span>
                {liveCount > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono transition-colors ${
                      activeTab === 'live'
                        ? 'bg-gangchill-blue/10 text-gangchill-blue font-bold'
                        : 'bg-gangchill-ink/5 text-gangchill-ink/60'
                    }`}
                  >
                    {toBanglaDigits(liveCount)}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('upcoming')}
                className={`relative pb-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  activeTab === 'upcoming'
                    ? 'text-gangchill-blue font-bold border-b-2 border-gangchill-blue'
                    : 'text-gangchill-ink/60 hover:text-gangchill-ink'
                }`}
              >
                <span>সামনে কী আসছে? (আসন্ন আহরণ)</span>
                {upcomingCount > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono transition-colors ${
                      activeTab === 'upcoming'
                        ? 'bg-gangchill-blue/10 text-gangchill-blue font-bold'
                        : 'bg-gangchill-ink/5 text-gangchill-ink/60'
                    }`}
                  >
                    {toBanglaDigits(upcomingCount)}
                  </span>
                )}
              </button>
            </div>

            {/* Small Top CTA: চাহিদা জানান → */}
            <button
              type="button"
              onClick={() => setIsRequirementModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-gangchill-blue bg-white/80 backdrop-blur-md hover:bg-gangchill-blue hover:text-white border border-gangchill-blue/30 transition-all duration-200 shadow-xs self-start sm:self-auto cursor-pointer group"
            >
              <ClipboardList className="w-3.5 h-3.5 text-gangchill-blue group-hover:text-white transition-colors" />
              <span>চাহিদা জানান</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* 3-Column Product Cards Grid (1 col mobile, 2 cols tablet, 3 cols desktop) */}
        {loading ? (
          <div className="py-20 text-center text-sm text-gangchill-ink/50 font-mono">
            মাছের স্টক বোর্ড লোড হচ্ছে...
          </div>
        ) : stocks.length === 0 ? (
          <div className="py-20 text-center text-sm text-gangchill-ink/60">
            বর্তমানে এই বিভাগে কোনো স্টক পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {stocks.map((stock, idx) => (
              <WholesaleStockCard key={stock.id} stock={stock} index={idx} />
            ))}
          </div>
        )}

        {/* Bottom Procurement Banner: যেটা খুঁজছেন, তালিকায় নেই? */}
        <div className="liquid-glass-card mt-16 sm:mt-24 p-6 sm:p-12 rounded-2xl sm:rounded-[28px] border border-white/90 shadow-glass text-center max-w-3xl mx-auto space-y-4 relative overflow-hidden">
          {/* Subtle decorative background wave */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-cyan-400/10 pointer-events-none blur-2xl" />
          <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-blue-600/10 pointer-events-none blur-2xl" />

          <div className="inline-flex items-center gap-1.5 text-xs font-bangla font-semibold text-gangchill-blue bg-gangchill-blue/10 px-3 py-1 rounded-full border border-gangchill-blue/20">
            <Sparkles className="w-3.5 h-3.5 text-gangchill-cyan" />
            <span>সরাসরি সোর্সিং সেবা</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold font-serifBangla text-gangchill-ink">
            যেটা খুঁজছেন, তালিকায় নেই?
          </h3>

          <p className="text-sm sm:text-base text-gangchill-ink/75 leading-relaxed font-light max-w-xl mx-auto">
            আপনার কী মাছ, কত পরিমাণে এবং কবে প্রয়োজন—আমাদের জানান। Gangchill সোর্সিং টিম আপনার প্রয়োজন অনুযায়ী ঘাট ও ঘের থেকে স্টক খুঁজে দ্রুত সরবরাহ নিশ্চিত করবে।
          </p>

          <div className="pt-3">
            <button
              type="button"
              onClick={() => setIsRequirementModalOpen(true)}
              className="px-6 py-3 rounded-natural bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white text-sm font-semibold shadow-xs transition-all duration-200 inline-flex items-center gap-2 cursor-pointer group"
            >
              <span>চাহিদা জানান</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </Container>

      {/* Corporate Requirement Modal */}
      <CorporateRequirementModal
        isOpen={isRequirementModalOpen}
        onClose={() => setIsRequirementModalOpen(false)}
      />
    </div>
  );
};
