import React, { useState } from 'react';
import { Container } from '../../components/common/Container';
import { ImageUploadMock } from '../../components/forms/ImageUploadMock';
import { SuccessState } from '../../components/common/SuccessState';
import { submissionService } from '../../services/submissionService';
import { normalizeBanglaToEnglishDigits } from '../../utils/formatters';

export const SellPage: React.FC = () => {
  const [selectedReadiness, setSelectedReadiness] = useState<'current' | 'upcoming' | null>(null);

  const [farmerName, setFarmerName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('চাঁদপুর');
  const [location, setLocation] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('কেজি (KG)');
  const [availabilityDate, setAvailabilityDate] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const districts = [
    'চাঁদপুর', 'খুলনা', 'সাতক্ষীরা', 'বরিশাল', 'ভোলা',
    'কক্সবাজার', 'ময়মনসিংহ', 'সুনামগঞ্জ', 'যশোর', 'নাটোর',
    'বাগেরহাট', 'পটুয়াখালী', 'কিশোরগঞ্জ', 'চট্টগ্রাম', 'অন্যান্য'
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!farmerName.trim()) errs.farmerName = 'আপনার নামটি লিখুন';
    const normalizedPhone = normalizeBanglaToEnglishDigits(phone.replace(/[\s-]/g, ''));
    if (!phone.trim()) {
      errs.phone = 'মোবাইল নম্বর লিখুন';
    } else if (!/^01[3-9]\d{8}$/.test(normalizedPhone)) {
      errs.phone = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)';
    }
    if (!productName.trim()) errs.productName = 'কী মাছ বিক্রি করতে চান লিখুন';
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      errs.quantity = 'পরিমাণ উল্লেখ করুন';
    }
    if (!location.trim()) errs.location = 'ঘাট, ঘের বা এলাকার নাম লিখুন';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await submissionService.submitFarmerStock({
        farmerName,
        phone,
        district,
        location,
        productName,
        stockType: selectedReadiness || 'current',
        quantity: Number(quantity),
        unit,
        availabilityDate: availabilityDate || undefined,
        expectedPrice: expectedPrice ? Number(expectedPrice) : undefined,
        description: description.trim() || undefined,
        images
      });

      if (res.success) {
        setSubmittedId(res.submissionId);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedReadiness(null);
    setFarmerName('');
    setPhone('');
    setLocation('');
    setProductName('');
    setQuantity('');
    setAvailabilityDate('');
    setExpectedPrice('');
    setDescription('');
    setImages([]);
    setErrors({});
    setSubmittedId(null);
  };

  return (
    <div className="bg-gangchill-canvas text-gangchill-ink min-h-screen py-10 sm:py-20">
      <Container size="md">
        {submittedId ? (
          <div className="max-w-xl mx-auto bg-white p-8 sm:p-12 border border-gangchill-ink/12">
            <SuccessState
              title="মাছের তথ্য গৃহীত হয়েছে"
              message="ধন্যবাদ! আপনার মাছের বিবরণ Gangchill সোর্সিং টিমের কাছে পৌঁছেছে। আমাদের প্রতিনিধি দ্রুত আপনার সাথে ফোনে কথা বলে সরাসরি ঘাট বা ঘের থেকে সংগ্রহ ও দর চূড়ান্ত করবে।"
              referenceId={submittedId}
              actionLabel="আরেকটি মাছের তথ্য জানান"
              onAction={handleReset}
            />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-12">
            {/* 1. Human Opening Message */}
            <div className="space-y-4 border-b border-gangchill-ink/12 pb-8">
              <div className="inline-flex items-center gap-2 text-xs font-bangla font-semibold text-gangchill-blue bg-gangchill-blue/10 px-3 py-1 rounded-full border border-gangchill-blue/20 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-gangchill-blue animate-pulse" />
                <span>জেলে, চাষি ও আড়তদারদের জন্য সরাসরি সুযোগ</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serifBangla text-gangchill-ink leading-tight">
                মাছ প্রস্তুত?<br />
                Gangchill-কে জানান।
              </h1>
              <p className="text-base sm:text-xl text-gangchill-ink/80 leading-relaxed font-light">
                আজকের stock হোক বা সামনে প্রস্তুত হবে—আপনার মাছের তথ্য আমাদের জানান। সরাসরি ঘাট ও ঘের থেকে ন্যায্যমূল্যে সংগ্রহের ব্যবস্থা নেওয়া হবে।
              </p>
            </div>

            {/* 2. The Two Natural Choices */}
            {!selectedReadiness ? (
              <div className="space-y-6">
                <h2 className="text-lg font-bold font-serifBangla text-gangchill-ink">
                  আপনার মাছ এখন কোন অবস্থায় আছে?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedReadiness('current')}
                    className="liquid-glass-card p-5 sm:p-8 text-left border border-white/90 rounded-2xl sm:rounded-natural flex flex-col justify-between shadow-glass hover:border-gangchill-blue/40 transition-all duration-300 group cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-mono text-gangchill-blue font-semibold mb-2">
                        অপশন ০১
                      </div>
                      <div className="text-xl sm:text-2xl font-bold font-serifBangla text-gangchill-blue mb-2">
                        এখন বিক্রির জন্য প্রস্তুত
                      </div>
                      <p className="text-xs text-gangchill-ink-muted leading-relaxed mb-4">
                        নদীতে ধরা হয়েছে, ঘেরে তোলা হচ্ছে বা ঘাটে আছে। এখনই দিতে চান।
                      </p>
                    </div>
                    <span className="text-xs font-bold text-gangchill-blue group-hover:translate-x-1 inline-block transition-transform">
                      তথ্য দিন →
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedReadiness('upcoming')}
                    className="liquid-glass-card p-5 sm:p-8 text-left border border-white/90 rounded-2xl sm:rounded-natural flex flex-col justify-between shadow-glass hover:border-cyan-400/40 transition-all duration-300 group cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-mono text-gangchill-cyan-deep font-semibold mb-2">
                        অপশন ০২
                      </div>
                      <div className="text-xl sm:text-2xl font-bold font-serifBangla text-gangchill-ink group-hover:text-gangchill-cyan-deep mb-2 transition-colors">
                        সামনে প্রস্তুত হবে
                      </div>
                      <p className="text-xs text-gangchill-ink-muted leading-relaxed mb-4">
                        ঘেরে বড় হচ্ছে বা আসন্ন জোতে নদী থেকে উঠবে। অগ্রিম বুকিং চান।
                      </p>
                    </div>
                    <span className="text-xs font-bold text-gangchill-cyan-deep group-hover:translate-x-1 inline-block transition-transform">
                      অগ্রিম জানান →
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              /* 3. The Natural Bangla Form */
              <form onSubmit={handleSubmit} className="liquid-glass p-5 sm:p-8 lg:p-10 border border-white/90 rounded-2xl sm:rounded-natural-lg shadow-glass-lg space-y-6 sm:space-y-8 animate-fade-in">
                <div className="flex items-center justify-between border-b border-gangchill-ink/8 pb-4">
                  <div className="text-sm font-bold font-serifBangla text-gangchill-blue">
                    {selectedReadiness === 'current' ? '✓ বর্তমান প্রস্তুত মাছ' : '⏳ আসন্ন আহরণের মাছ'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedReadiness(null)}
                    className="text-xs text-gangchill-ink-muted hover:text-gangchill-ink underline"
                  >
                    পরিবর্তন করুন
                  </button>
                </div>

                {/* Section 1: Farmer/Fisherman Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bangla font-semibold text-gangchill-earth tracking-wide border-b border-gangchill-ink/10 pb-1">
                    ১. আপনার পরিচয়
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-semibold text-gangchill-ink">আপনার নাম *</label>
                      <input
                        type="text"
                        placeholder="যেমন: মো: আবুল কাশেম"
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gangchill-canvas/40 border border-gangchill-ink/20 text-base sm:text-sm rounded-xl focus:bg-white focus:outline-none focus:border-gangchill-green"
                      />
                      {errors.farmerName && <p className="text-xs text-red-600">{errors.farmerName}</p>}
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs font-semibold text-gangchill-ink">মোবাইল নম্বর *</label>
                      <input
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gangchill-canvas/40 border border-gangchill-ink/20 text-base sm:text-sm rounded-xl focus:bg-white focus:outline-none focus:border-gangchill-green"
                      />
                      {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-semibold text-gangchill-ink">জেলা</label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gangchill-canvas/40 border border-gangchill-ink/20 text-base sm:text-sm rounded-xl focus:bg-white focus:outline-none focus:border-gangchill-green"
                      >
                        {districts.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs font-semibold text-gangchill-ink">মাছ কোথায় আছে? (ঘাট / ঘের / এলাকা) *</label>
                      <input
                        type="text"
                        placeholder="যেমন: বড়স্টেশন ঘাট / পাইকগাছা ঘের"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gangchill-canvas/40 border border-gangchill-ink/20 text-base sm:text-sm rounded-xl focus:bg-white focus:outline-none focus:border-gangchill-green"
                      />
                      {errors.location && <p className="text-xs text-red-600">{errors.location}</p>}
                    </div>
                  </div>
                </div>

                {/* Section 2: Fish Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bangla font-semibold text-gangchill-earth tracking-wide border-b border-gangchill-ink/10 pb-1">
                    ২. মাছের তথ্য
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1 space-y-1 text-left">
                      <label className="text-xs font-semibold text-gangchill-ink">কী মাছ বিক্রি করতে চান? *</label>
                      <input
                        type="text"
                        placeholder="যেমন: চাঁদপুরের ইলিশ / বাগদা চিংড়ি"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gangchill-canvas/40 border border-gangchill-ink/20 text-base sm:text-sm rounded-xl focus:bg-white focus:outline-none focus:border-gangchill-green"
                      />
                      {errors.productName && <p className="text-xs text-red-600">{errors.productName}</p>}
                    </div>

                    <div className="sm:col-span-1 space-y-1 text-left">
                      <label className="text-xs font-semibold text-gangchill-ink">কতটুকু আছে? *</label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="যেমন: ৫০০"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gangchill-canvas/40 border border-gangchill-ink/20 text-base sm:text-sm rounded-xl focus:bg-white focus:outline-none focus:border-gangchill-green"
                      />
                      {errors.quantity && <p className="text-xs text-red-600">{errors.quantity}</p>}
                    </div>

                    <div className="sm:col-span-1 space-y-1 text-left">
                      <label className="text-xs font-semibold text-gangchill-ink">একক</label>
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gangchill-canvas/40 border border-gangchill-ink/20 text-base sm:text-sm rounded-xl focus:bg-white focus:outline-none focus:border-gangchill-green"
                      >
                        <option value="কেজি (KG)">কেজি (KG)</option>
                        <option value="টন (MT)">টন (MT)</option>
                        <option value="মণ">মণ</option>
                        <option value="কার্টন/বক্স">কার্টন/বক্স</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-semibold text-gangchill-ink">কবে থেকে সংগ্রহ করা যাবে?</label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={availabilityDate}
                        onChange={(e) => setAvailabilityDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gangchill-canvas/40 border border-gangchill-ink/20 text-base sm:text-sm rounded-xl focus:bg-white focus:outline-none focus:border-gangchill-green"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs font-semibold text-gangchill-ink">আশানুরূপ দর (প্রতি কেজি ৳) (ঐচ্ছিক)</label>
                      <input
                        type="number"
                        placeholder="যেমন: ১২০০"
                        value={expectedPrice}
                        onChange={(e) => setExpectedPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gangchill-canvas/40 border border-gangchill-ink/20 text-base sm:text-sm rounded-xl focus:bg-white focus:outline-none focus:border-gangchill-green"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-gangchill-ink">মাছ সম্পর্কে কিছু বলতে চান? (ঐচ্ছিক)</label>
                    <textarea
                      rows={2}
                      placeholder="যেমন: ইলিশ ১ কেজি সাইজ, বরফে ইনসুলেটেড, আজ ভোরের ধরা..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gangchill-canvas/40 border border-gangchill-ink/20 text-base sm:text-sm rounded-xl focus:bg-white focus:outline-none focus:border-gangchill-green"
                    />
                  </div>

                  <ImageUploadMock onImagesChange={setImages} label="মাছের ছবি (মোবাইল ক্যামেরা বা গ্যালারি থেকে)" />
                </div>

                <div className="pt-4 border-t border-gangchill-ink/10">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white font-bold text-base transition-all text-center rounded-xl shadow-glass-glow cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'জমা হচ্ছে...' : 'Gangchill-কে মাছের তথ্য জানান →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};
