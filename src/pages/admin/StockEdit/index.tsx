import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { StockStatus } from '../../../types/stock';
import { ImageUploader } from '../../../components/admin/ImageUploader';

const CATEGORIES = [
  'ইলিশ',
  'চিংড়ি',
  'পাবদা',
  'কার্প / রুই-কাতলা',
  'শুঁটকি',
  'ভেটকি / কোরাল',
  'দেশি শিং-মাগুর',
  'অন্যান্য সামুদ্রিক মাছ'
];

const DISTRICTS = [
  'চাঁদপুর', 'খুলনা', 'সাতক্ষীরা', 'কক্সবাজার', 'বরিশাল',
  'ভোলা', 'নাটোর', 'ময়মনসিংহ', 'চট্টগ্রাম', 'বাগেরহাট', 'পাবনা'
];

const PRESET_IMAGES = [
  { label: 'নৌকা ও জেলেদের মাছ ধরা', url: '/hero-fishermen-boat.png' },
  { label: 'চলনবিলের তাজা পাবদা', url: '/chalanbeel-pabda.jpg' },
  { label: 'নাজিরারটেক শুঁটকি', url: '/nazirartek-shutki.jpg' }
];

export const AdminStockEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [banglaName, setBanglaName] = useState('');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [status, setStatus] = useState<StockStatus>('live');
  const [quantity, setQuantity] = useState<number>(500);
  const [unit, setUnit] = useState('কেজি (KG)');
  const [price, setPrice] = useState<number>(1200);
  const [minimumOrder, setMinimumOrder] = useState<number>(50);
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [division, setDivision] = useState('চট্টগ্রাম');
  const [grade, setGrade] = useState('গ্রেড A (এক্সপোর্ট কোয়ালিটি)');
  const [packaging, setPackaging] = useState('ইনসুলেটেড আইস বক্স');
  const [availabilityDate, setAvailabilityDate] = useState('আজকের তাজা সংগ্রহ');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>(['/hero-fishermen-boat.png']);

  const [warehouseReady, setWarehouseReady] = useState(true);
  const [transportAssistance, setTransportAssistance] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const existing = adminService.getStockById(id);
      if (existing) {
        setBanglaName(existing.banglaName);
        setProductName(existing.productName);
        setCategory(existing.category);
        setStatus(existing.status);
        setQuantity(existing.quantity);
        setUnit(existing.unit);
        setPrice(existing.price || 0);
        setMinimumOrder(existing.minimumOrder || 50);
        setLocation(existing.location);
        setDistrict(existing.district);
        setDivision(existing.division || 'বিভাগ');
        setGrade(existing.grade || '');
        setPackaging(existing.packaging || '');
        setAvailabilityDate(existing.availabilityDate || existing.harvestDate || '');
        setDescription(existing.description);
        setImages(existing.images || []);
        setWarehouseReady(existing.logistics?.warehouseReady ?? true);
        setTransportAssistance(existing.logistics?.transportAssistance ?? true);
      }
    }
  }, [id]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!banglaName.trim()) errs.banglaName = 'মাছের বাংলা নামটি আবশ্যক';
    if (!productName.trim()) errs.productName = 'ইংরেজি রেফারেন্স নাম আবশ্যক';
    if (!quantity || quantity <= 0) errs.quantity = 'সঠিক পরিমাণ উল্লেখ করুন';
    if (!location.trim()) errs.location = 'উৎস ঘাট বা এলাকার নাম লিখুন';
    if (!description.trim()) errs.description = 'সংক্ষিপ্ত বিবরণ লিখুন';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);

    const slug = isEditing && id
      ? (adminService.getStockById(id)?.slug || productName.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
      : `${productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const stockPayload = {
      slug,
      banglaName,
      productName,
      category,
      status,
      quantity,
      unit,
      price,
      minimumOrder,
      location,
      district,
      division,
      grade,
      packaging,
      availabilityDate,
      description,
      images: images.length > 0 ? images : ['/hero-fishermen-boat.png'],
      logistics: {
        warehouseReady,
        transportAssistance,
        estimatedDeliveryDays: 'আজ বিকেলে ঢাকায় সরাসরি কোল্ডচেইন ডেলিভারি'
      }
    };

    if (isEditing && id) {
      adminService.updateStock(id, stockPayload);
    } else {
      adminService.createStock(stockPayload);
    }

    setSaving(false);
    navigate('/admin/stocks');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <Link
          to="/admin/stocks"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>স্টক তালিকায় ফিরে যান</span>
        </Link>
        <span className="text-xs font-mono text-slate-400">
          {isEditing ? `ID: ${id}` : 'NEW STOCK LOT'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="font-bold font-serifBangla text-base text-slate-900 border-b border-slate-100 pb-3">
            ১. মাছের প্রাথমিক বিবরণ
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-slate-700">মাছের বাংলা নাম *</label>
              <input
                type="text"
                placeholder="যেমন: চাঁদপুরের পদ্মার রূপালী ইলিশ"
                value={banglaName}
                onChange={(e) => setBanglaName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500/20 font-medium transition-colors"
              />
              {errors.banglaName && <p className="text-[11px] text-rose-500">{errors.banglaName}</p>}
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">ইংরেজি রেফারেন্স নাম *</label>
              <input
                type="text"
                placeholder="e.g. Chandpur Padma River Hilsa"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500/20 font-medium transition-colors"
              />
              {errors.productName && <p className="text-[11px] text-rose-500">{errors.productName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-slate-700">ক্যাটাগরি</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">স্টকের বর্তমান অবস্থা</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StockStatus)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
              >
                <option value="live">লাইভ প্রস্তুত স্টক (Live)</option>
                <option value="upcoming">আসন্ন আহরণ (Upcoming)</option>
                <option value="sold">স্টক সমাপ্ত (Sold)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">সাইজ ও কোয়ালিটি গ্রেড</label>
              <input
                type="text"
                placeholder="যেমন: ১ কেজি - ১.২ কেজি সাইজ"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Volume & Pricing */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="font-bold font-serifBangla text-base text-slate-900 border-b border-slate-100 pb-3">
            ২. পরিমাণ ও পাইকারি মূল্য
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-slate-700">মজুদ পরিমাণ *</label>
              <input
                type="number"
                step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
              />
              {errors.quantity && <p className="text-[11px] text-rose-500">{errors.quantity}</p>}
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">একক (Unit)</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
              >
                <option value="কেজি (KG)">কেজি (KG)</option>
                <option value="টন (MT)">টন (MT)</option>
                <option value="মন (Maund)">মন (Maund)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">পাইকারি দর (৳/কেজি)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">ন্যূনতম ক্রয়াদেশ (MOQ)</label>
              <input
                type="number"
                value={minimumOrder}
                onChange={(e) => setMinimumOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition-colors">
              <input
                type="checkbox"
                checked={warehouseReady}
                onChange={(e) => setWarehouseReady(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-slate-700 font-medium">ওয়্যারহাউজ প্যাকিং প্রস্তুত</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition-colors">
              <input
                type="checkbox"
                checked={transportAssistance}
                onChange={(e) => setTransportAssistance(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-slate-700 font-medium">কোল্ড চেইন পরিবহন সহায়তা অন্তর্ভুক্ত</span>
            </label>
          </div>
        </div>

        {/* Section 3: Sourcing & Location */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="font-bold font-serifBangla text-base text-slate-900 border-b border-slate-100 pb-3">
            ৩. আহরণ ঘাট ও অঞ্চলের তথ্য
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-medium text-slate-700">নির্দিষ্ট ঘাট / খামারের অবস্থান *</label>
              <input
                type="text"
                placeholder="যেমন: বড়স্টেশন মোহনা ঘাট, চাঁদপুর"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 focus:bg-white"
              />
              {errors.location && <p className="text-[11px] text-rose-500">{errors.location}</p>}
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">জেলা</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-slate-700">কোল্ড চেইন প্যাকেজিং বিবরণ</label>
              <input
                type="text"
                placeholder="যেমন: ইনসুলেটেড আইস বক্স ও থার্মাল কাভার"
                value={packaging}
                onChange={(e) => setPackaging(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">প্রাপ্যতা বা আহরণের তারিখ</label>
              <input
                type="text"
                placeholder="যেমন: আজকের তাজা সংগ্রহ"
                value={availabilityDate}
                onChange={(e) => setAvailabilityDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-slate-700">স্টক লটের বর্ণনা *</label>
            <textarea
              rows={3}
              placeholder="মাছের সাইজ, তাজাত্ব, সংরক্ষণ পদ্ধতি ইত্যাদি সম্পর্কে বিস্তারিত..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 focus:bg-white"
            />
            {errors.description && <p className="text-[11px] text-rose-500">{errors.description}</p>}
          </div>
        </div>

        {/* Section 4: Images */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="font-bold font-serifBangla text-base text-slate-900 border-b border-slate-100 pb-3">
            ৪. মাছের ছবি ও গ্যালারি
          </h2>

          <ImageUploader
            multiple={true}
            value={images}
            onChange={setImages}
            maxImages={6}
            presets={PRESET_IMAGES}
            helperText="সর্বোচ্চ ৬টি ছবি যুক্ত করা যাবে"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/admin/stocks"
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 font-medium shadow-xs transition-colors"
          >
            বাতিল
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs flex items-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'আপডেট সংরক্ষণ করুন' : 'স্টক লট প্রকাশ করুন'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
