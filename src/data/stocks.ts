import { Stock } from '../types/stock';

export const MOCK_STOCKS: Stock[] = [
  {
    id: 'fish-1',
    slug: 'chandpur-padma-hilsa-live',
    productName: 'Chandpur Padma River Hilsa',
    banglaName: 'চাঁদপুরের পদ্মার রূপালী ইলিশ',
    category: 'ইলিশ',
    status: 'live',
    quantity: 1.2,
    unit: 'টন (MT)',
    location: 'বড়স্টেশন ঘাট, চাঁদপুর',
    district: 'চাঁদপুর',
    division: 'চট্টগ্রাম',
    grade: 'গ্রেড A (১ কেজি - ১.২ কেজি সাইজ)',
    harvestDate: 'আজ ভোরের আহরণ',
    packaging: 'ইনসুলেটেড আইস বক্স (২০ কেজি)',
    minimumOrder: 100,
    price: 1650,
    priceType: 'fixed',
    description: 'চাঁদপুরের বড়স্টেশন মাছঘাট থেকে সরাসরি সংগৃহীত পদ্মার খাঁটি রূপালী ইলিশ। চকচকে আঁশ, উজ্জ্বল চোখ ও অক্ষত পেট। কর্পোরেট ক্যাটারিং, এক্সক্লুসিভ সুপারমার্কেট ও প্রিমিয়াম হোটেলের জন্য শতভাগ উপযুক্ত। কোল্ড-চেইন ট্রাকে তাজা ডেলিভারি।',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534943441045-1089b75eb353?auto=format&fit=crop&w=1200&q=80'
    ],
    specifications: [
      { label: 'মাছের ধরন', value: 'পদ্মা ও মেঘনা নদীর টাটকা ইলিশ' },
      { label: 'আকার ও ওজন', value: '১০০০ গ্রাম - ১২০০ গ্রাম প্রতি পিস' },
      { label: 'তাজাত্ব সূচক', value: '১০০% টাটকা (ফ্রিজিং ছাড়া ফ্রেশ বরফ দেওয়া)' },
      { label: 'সংরক্ষণ পদ্ধতি', value: 'ফুড-গ্রেড প্লাস্টিক ইনসুলেটেড আইস চেম্বার' },
      { label: 'প্যাকেজিং', value: '২০ কেজি এয়ারটাইট থার্মোকল / ক্রাফট বক্স' },
      { label: 'ন্যূনতম ক্রয়সীমা', value: '১০০ কেজি' }
    ],
    originDetails: {
      unionOrVillage: 'বড়স্টেশন ও মোহনা ঘাট',
      farmerGroup: 'মেঘনা মোহনা জেলে সমবায় ক্লাস্টার',
      farmingMethod: 'নদীর প্রাকৃতিক মাছ ধরা (জাল আহরণ)'
    },
    logistics: {
      warehouseReady: true,
      transportAssistance: true,
      estimatedDeliveryDays: 'আজ বিকেলে ঢাকায় সরাসরি কোল্ডচেইন ডেলিভারি'
    },
    featured: true
  },
  {
    id: 'fish-2',
    slug: 'khulna-black-tiger-bagda-shrimp',
    productName: 'Khulna Black Tiger Bagda Shrimp',
    banglaName: 'খুলনা ও সাতক্ষীরার বাগদা চিংড়ি',
    category: 'চিংড়ি',
    status: 'live',
    quantity: 850,
    unit: 'কেজি (KG)',
    location: 'পাইকগাছা, খুলনা',
    district: 'খুলনা',
    division: 'খুলনা',
    grade: 'এক্সপোর্ট গ্রেড (১৬/২০ কাউন্ট)',
    harvestDate: 'আজকের সংগ্রহ',
    packaging: '১০ ও ২০ কেজি আইস ক্রাফট কার্টন',
    minimumOrder: 50,
    price: 920,
    priceType: 'fixed',
    description: 'খুলনা ও সাতক্ষীরার লবণাক্ত পানির প্রাকৃতিক ঘের থেকে ভোরে আহরিত এক্সপোর্ট কোয়ালিটি বাগদা চিংড়ি। হেড-অন শেল-অন (HOSO), শক্ত খোলস এবং চমৎকার চকচকে রঙ। সিফুড প্রসেসিং কারখানা ও চাইনিজ রেস্তোরাঁ চেইনের জন্য আদর্শ।',
    images: [
      'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=1200&q=80'
    ],
    specifications: [
      { label: 'প্রজাতি', value: 'ব্ল্যাক টাইগার (Penaeus monodon)' },
      { label: 'গ্রেড ও কাউন্ট', value: '১৬-২০ পিস প্রতি কেজি' },
      { label: 'প্রসেসিং অবস্থা', value: 'ফ্রেশ হেড-অন শেল-অন (HOSO)' },
      { label: 'অ্যান্টিবায়োটিক স্ট্যাটাস', value: '১০০% পরীক্ষিত ও অর্গানিক ঘের' }
    ],
    originDetails: {
      unionOrVillage: 'কপোতাক্ষ অববাহিকা ক্লাস্টার',
      farmerGroup: 'পাইকগাছা চিংড়ি চাষী ফোরাম',
      farmingMethod: 'ঐতিহ্যবাহী লবণাক্ত পানির প্রাকৃতিক ঘের'
    },
    logistics: {
      warehouseReady: true,
      transportAssistance: true,
      estimatedDeliveryDays: '২৪ ঘণ্টার মধ্যে সারা দেশে সরবরাহ'
    },
    featured: true
  },
  {
    id: 'fish-3',
    slug: 'mymensingh-live-deshi-rui',
    productName: 'Mymensingh Fresh Deshi Rui',
    banglaName: 'ময়মনসিংহের তাজা দেশি রুই',
    category: 'দেশি মাছ',
    status: 'live',
    quantity: 2.5,
    unit: 'টন (MT)',
    location: 'ত্রিশাল ও তারাকান্দা, ময়মনসিংহ',
    district: 'ময়মনসিংহ',
    division: 'ময়মনসিংহ',
    grade: 'গ্রেড A (২.৫ কেজি - ৩.৫ কেজি সাইজ)',
    harvestDate: 'আজ সকালে জলাশয় থেকে ধরা',
    packaging: 'অক্সিজেন ড্রাম ও আইস বক্স',
    minimumOrder: 200,
    price: 360,
    priceType: 'fixed',
    description: 'ব্রহ্মপুত্র অববাহিকার গভীর মিষ্টি পানির পুকুর থেকে সংগৃহীত বড় সাইজের লালচে রুই মাছ। ফিড-গন্ধহীন, সুস্বাদু ও তেলতেলে পেট। রাজধানীর পাইকারি আড়ত, ক্যাটারার ও সুপারশপে জীবন্ত বা ড্রাম-বরফে সরবরাহের সুবিধা।',
    images: [
      'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1200&q=80'
    ],
    specifications: [
      { label: 'প্রজাতি', value: 'দেশি রুই (Labeo rohita)' },
      { label: 'ওজন সাইজ', value: '২.৫ কেজি থেকে ৩.৫ কেজি+' },
      { label: 'ডেলিভারি ধরন', value: 'লাইভ অক্সিজেন ওয়াটার ভ্যান অথবা বরফ লট' },
      { label: 'প্যাকেজিং', value: '৫০ কেজি ড্রাম / ক্রাফট বক্স' }
    ],
    originDetails: {
      unionOrVillage: 'ত্রিশাল ফিশারি ক্লাস্টার',
      farmerGroup: 'ময়মনসিংহ একোয়া কালচার সমবায়',
      farmingMethod: 'প্রাকৃতিক প্রবাহমান মিষ্টি পানির খামার'
    },
    logistics: {
      warehouseReady: true,
      transportAssistance: true,
      estimatedDeliveryDays: '৮ ঘণ্টার মধ্যে ঢাকায় সরাসরি ডেলিভারি'
    },
    featured: true
  },
  {
    id: 'fish-4',
    slug: 'coxsbazar-loitta-rupchanda-dry-fish',
    productName: 'Coxs Bazar Organic Dry Fish (Shutki)',
    banglaName: 'কক্সবাজারের অর্গানিক লইট্যা ও রূপচাঁদা শুঁটকি',
    category: 'শুঁটকি',
    status: 'live',
    quantity: 1.5,
    unit: 'টন (MT)',
    location: 'নাজিরারটেক, কক্সবাজার',
    district: 'কক্সবাজার',
    division: 'চট্টগ্রাম',
    grade: 'এক্সপোর্ট প্রিমিয়াম (কীটনাশকমুক্ত)',
    harvestDate: 'সেপ্টেম্বর ২০২৬ ব্যাচ',
    packaging: '২৫ কেজি পলি-লাইনড চটের বস্তা',
    minimumOrder: 50,
    price: 850,
    priceType: 'fixed',
    description: 'কক্সবাজারের ঐতিহ্যবাহী নাজিরারটেক শুঁটকি পল্লীতে সম্পূর্ণ বিষমুক্ত ও প্রাকৃতিক সমুদ্রের বাতাসে শুকানো লইট্যা ও রূপচাঁদা শুঁটকি। কোনো কীটনাশক বা রাসায়নিক দেওয়া হয়নি। দীর্ঘস্থায়ী ও নির্ভেজাল স্বাদ।',
    images: [
      '/nazirartek-shutki.jpg'
    ],
    specifications: [
      { label: 'মাছের ধরন', value: 'লইট্যা, রূপচাঁদা ও ছুরি শুঁটকি' },
      { label: 'শুকানোর পদ্ধতি', value: '১০০% রোদে ও সমুদ্রের বাতাসে ড্রাইং (অর্গানিক)' },
      { label: 'আর্দ্রতা', value: 'সর্বোচ্চ ১২%' },
      { label: 'রাসায়নিক ও লবণ', value: 'সম্পূর্ণ কীটনাশকমুক্ত, পরিমিত লবণ' }
    ],
    originDetails: {
      unionOrVillage: 'নাজিরারটেক শুঁটকি পল্লী',
      farmerGroup: 'কক্সবাজার অর্গানিক শুঁটকি উৎপাদক দল',
      farmingMethod: 'ঐতিহ্যবাহী মাচা পদ্ধতি ও সোলার ড্রাই'
    },
    logistics: {
      warehouseReady: true,
      transportAssistance: true,
      estimatedDeliveryDays: '২৪-৪৮ ঘণ্টার মধ্যে সারা দেশে সরবরাহ'
    },
    featured: true
  },
  {
    id: 'fish-5',
    slug: 'barisal-meghna-hilsa-upcoming',
    productName: 'Barisal River Hilsa Upcoming Batch',
    banglaName: 'বরিশাল ও ভোলার নদীর তাজা ইলিশ (আসন্ন লট)',
    category: 'ইলিশ',
    status: 'upcoming',
    quantity: 2.0,
    unit: 'টন (MT)',
    location: 'পোর্ট রোড ঘাট, বরিশাল',
    district: 'বরিশাল',
    division: 'বরিশাল',
    grade: 'সুপার গ্রেড (৮০০ গ্রাম - ১ কেজি)',
    availabilityDate: '১২ সেপ্টেম্বর ২০২৬',
    packaging: 'ইনসুলেটেড আইস বক্স',
    minimumOrder: 100,
    price: 1350,
    priceType: 'contact',
    description: 'তেঁতুলিয়া ও মেঘনার সংযোগস্থল থেকে আসন্ন অমাবস্যার জোতে আহরিত হতে যাওয়া প্রিমিয়াম সাইজের ইলিশের লট। বড় পাইকার ও করপোরেট ক্রয়ের জন্য অগ্রিম বুকিং নেওয়া হচ্ছে।',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80'
    ],
    specifications: [
      { label: 'উৎস নদী', value: 'মেঘনা ও তেঁতুলিয়া মোহনা' },
      { label: 'প্রত্যাশিত ওজন', value: '৮০০ গ্রাম - ১০০০ গ্রাম' },
      { label: 'সংগ্রহ উইন্ডো', value: '১২-১৫ সেপ্টেম্বর ২০২৬' }
    ],
    originDetails: {
      unionOrVillage: 'পোর্ট রোড ও ভোলা চরফ্যাশন ক্লাস্টার',
      farmerGroup: 'দক্ষিণাঞ্চল মৎস্যজীবী সমবায়',
      farmingMethod: 'নদীর ট্রলার আহরণ'
    },
    logistics: {
      warehouseReady: false,
      transportAssistance: true,
      estimatedDeliveryDays: 'আহরণের দিনে সরাসরি ভোরে ডেলিভারি'
    }
  },
  {
    id: 'fish-6',
    slug: 'jessore-freshwater-golda-prawn',
    productName: 'Jessore Freshwater Golda Prawn',
    banglaName: 'যশোরের মিঠাপানির গলদা চিংড়ি (আসন্ন লট)',
    category: 'চিংড়ি',
    status: 'upcoming',
    quantity: 1.2,
    unit: 'টন (MT)',
    location: 'কেশবপুর ও অভয়নগর, যশোর',
    district: 'যশোর',
    division: 'খুলনা',
    grade: 'গ্রেড A (৮-১২ কাউন্ট)',
    availabilityDate: '১৮ সেপ্টেম্বর ২০২৬',
    packaging: 'আইস চেম্বার বক্স',
    minimumOrder: 40,
    price: 1100,
    priceType: 'negotiable',
    description: 'যশোরের মিষ্টি পানির ঐতিহ্যবাহী ঘের থেকে আসন্ন গলদা চিংড়ি সংগ্রহের লট। বড় নখযুক্ত, মোটা শরীর ও সুস্বাদু স্বাদের জন্য বিখ্যাত।',
    images: [
      'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=80'
    ],
    specifications: [
      { label: 'প্রজাতি', value: 'মিঠাপানির গলদা (Macrobrachium rosenbergii)' },
      { label: 'কাউন্ট', value: '৮-১২ পিস প্রতি কেজি (জায়ান্ট সাইজ)' },
      { label: 'সংগ্রহ এলাকা', value: 'যশোর ঘের বেল্ট' }
    ],
    originDetails: {
      unionOrVillage: 'কেশবপুর একোয়া জোন',
      farmerGroup: 'যশোর গলদা চাষী সমবায়',
      farmingMethod: 'মিষ্টি পানির পরিবেশবান্ধব মিশ্র ঘের'
    },
    logistics: {
      warehouseReady: false,
      transportAssistance: true,
      estimatedDeliveryDays: '১৮ সেপ্টেম্বর থেকে সরাসরি ডেলিভারি'
    }
  },
  {
    id: 'fish-7',
    slug: 'sylhet-haor-shing-koi-live',
    productName: 'Sylhet Haor Deshi Shing & Koi',
    banglaName: 'সিলেট ও সুনামগঞ্জ হাওরের জীবন্ত দেশি শিং ও কৈ',
    category: 'দেশি মাছ',
    status: 'live',
    quantity: 600,
    unit: 'কেজি (KG)',
    location: 'তাহিরপুর হাওর, সুনামগঞ্জ',
    district: 'সুনামগঞ্জ',
    division: 'সিলেট',
    grade: 'খাঁটি হাওরের ন্যাচারাল',
    harvestDate: 'আজ সকালে আহরিত',
    packaging: 'লাইভ ওয়াটার ড্রাম',
    minimumOrder: 50,
    price: 680,
    priceType: 'fixed',
    description: 'টাঙ্গুয়ার হাওরের প্রাকৃতিক জলাশয় থেকে স্থানীয় জেলেদের দ্বারা আহরিত খাঁটি দেশি জ্যান্ত শিং ও কৈ মাছ। ১০০% কৃত্রিম খাদ্যমুক্ত ও পুষ্টিগুণে সমৃদ্ধ।',
    images: [
      'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1200&q=80'
    ],
    specifications: [
      { label: 'মাছের জাত', value: 'দেশি শিং ও দেশি কৈ' },
      { label: 'উৎস', value: 'টাঙ্গুয়ার হাওরের মুক্ত জলাশয়' },
      { label: 'অবস্থা', value: 'জীবন্ত (Live Delivery)' }
    ],
    originDetails: {
      unionOrVillage: 'তাহিরপুর হাওর এলাকা',
      farmerGroup: 'হাওর মৎস্যজীবী সমিতি',
      farmingMethod: 'মুক্ত জলাশয়ের প্রাকৃতিক মাছ'
    },
    logistics: {
      warehouseReady: true,
      transportAssistance: true,
      estimatedDeliveryDays: 'অক্সিজেন ভ্যানে ১২ ঘণ্টায় ঢাকা ও সিলেট সরবরাহ'
    }
  },
  {
    id: 'fish-8',
    slug: 'natore-chalanbeel-pabda',
    productName: 'Chalan Beel Fresh Pabda Fish',
    banglaName: 'নাটোর চলনবিলের তাজা পাবদা মাছ',
    category: 'দেশি মাছ',
    status: 'live',
    quantity: 500,
    unit: 'কেজি (KG)',
    location: 'সিংড়া, নাটোর',
    district: 'নাটোর',
    division: 'রাজশাহী',
    grade: 'গ্রেড A (২০-২৫ পিস/কেজি)',
    harvestDate: 'আজ ভোরের আহরণ',
    packaging: 'আইস ক্রাফট বক্স',
    minimumOrder: 30,
    price: 480,
    priceType: 'fixed',
    description: 'চলনবিলের সুমিষ্ট পানির চকচকে তাজা পাবদা মাছ। কাঁটাহীন নরম মাংস ও তুলনাহীন স্বাদ। সুপারমার্কেট ও প্রিমিয়াম হোটেলের সরাসরি সংগ্রহের জন্য প্রস্তুত।',
    images: [
      '/chalanbeel-pabda.jpg'
    ],
    specifications: [
      { label: 'জাত', value: 'দেশি পাবদা (Ompok pabda)' },
      { label: 'সাইজ', value: '২০-২৫ পিস প্রতি কেজি' },
      { label: 'সংরক্ষণ', value: 'ফ্রিজিং ছাড়া বরফে টাটকা সংরক্ষিত' }
    ],
    originDetails: {
      unionOrVillage: 'সিংড়া চলনবিল জোন',
      farmerGroup: 'চলনবিল দেশি মৎস্য উৎপাদনকারী দল',
      farmingMethod: 'বিল সংলগ্ন প্রাকৃতিক খামার'
    },
    logistics: {
      warehouseReady: true,
      transportAssistance: true,
      estimatedDeliveryDays: 'আজ বিকেলের মধ্যে ঢাকা পৌঁছাবে'
    }
  }
];
