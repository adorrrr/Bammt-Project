import { InvestmentOpportunity } from '../types/investment';

export const MOCK_INVESTMENTS: InvestmentOpportunity[] = [
  {
    id: 'inv-fish-1',
    slug: 'chandpur-hilsa-coldchain-procurement',
    stockId: 'fish-1',
    title: 'চাঁদপুর বড়স্টেশন ঘাট থেকে ২ টন ইলিশ সংগ্রহ',
    productName: 'পদ্মা ও মেঘনার রূপালী ইলিশ',
    category: 'ইলিশ',
    location: 'বড়স্টেশন ঘাট, চাঁদপুর',
    requiredCapital: 3000000,
    raisedCapital: 2150000,
    minimumInvestment: 50000,
    profitPercentage: 8.5,
    durationDays: 45,
    startDate: '১ সেপ্টেম্বর ২০২৬',
    settlementDate: '১৫ অক্টোবর ২০২৬',
    status: 'open',
    investorCount: 26,
    description: 'চাঁদপুরের বড়স্টেশন মাছঘাট থেকে সরাসরি তালিকাভুক্ত জেলে ট্রলার থেকে ২ টন প্রিমিয়াম পদ্মা-মেঘনা ইলিশ সংগ্রহ, আইসিং ও দ্রুত কোল্ড-চেইন ট্রান্সপোর্টের মাধ্যমে ঢাকার শীর্ষ ৪টি সুপারমার্কেট চেইনে সরবরাহের একটি লাভজনক প্রকল্প।',
    procurementPlan: {
      targetQuantity: 2.0,
      unit: 'টন (MT)',
      sourceRegion: 'বড়স্টেশন ঘাট ও মেঘনা মোহনা, চাঁদপুর',
      targetBuyers: 'শীর্ষস্থানীয় সুপারশপ চেইন, কর্পোরেট ক্যাটারার ও প্রিমিয়াম পাইকার',
      purchaseWindow: '১ সেপ্টেম্বর - ৮ সেপ্টেম্বর ২০২৬',
      salesWindow: '১০ সেপ্টেম্বর - ৫ অক্টোবর ২০২৬'
    },
    timeline: [
      {
        stage: 1,
        title: 'বিনিয়োগ তহবিল সংগ্রহ',
        duration: '৭ দিন',
        description: 'অনলাইন পোর্টালের মাধ্যমে ৳ ৩০,০০,০০০ মূলধন সংগ্রহ সম্পন্ন করা।',
        status: 'active'
      },
      {
        stage: 2,
        title: 'চাঁদপুর ঘাট থেকে সরাসরি ট্রলার আহরণ ক্রয়',
        duration: '১০ দিন',
        description: 'জেলে নৌকা ও আড়ত থেকে তাজা ইলিশ ওজন, কোয়ালিটি গ্রেডিং ও থার্মোকল বক্সে আইসিং।',
        status: 'pending'
      },
      {
        stage: 3,
        title: 'কোল্ডচেইন ডেলিভারি ও চালান হস্তান্তর',
        duration: '২০ দিন',
        description: 'তাপমাত্রা নিয়ন্ত্রিত রেফ্রিজারেটেড ভ্যানে সুপারশপ ওয়্যারহাউসে ডেলিভারি ও ইনভয়েস সমন্বয়।',
        status: 'pending'
      },
      {
        stage: 4,
        title: 'হিসাব নিষ্পত্তি ও ৮.৫% লভ্যাংশ ফেরত',
        duration: '৮ দিন',
        description: 'বিক্রয়লব্ধ অর্থ ব্যাংক এস্ক্রো একাউন্ট থেকে বিনিয়োগকারীদের অ্যাকাউন্টে মুনাফাসহ ফেরত।',
        status: 'pending'
      }
    ],
    risks: [
      'মাছের সতেজতা বজায় রাখতে Gangchill নিজস্ব ইনসুলেটেড আইস চেইন ও ডিজিটাল থার্মোমিটার ব্যবহার করে।',
      'আহরিত মাছের পূর্বেই করপোরেট কার্যাদেশ (Purchase Order) নিশ্চিত থাকায় বিক্রয় ঝুঁকি নেই।'
    ],
    securityAndCompliance: [
      'প্রতিটি বিনিয়োগের বিপরীতে আইনি ডিজিটাল চুক্তিপত্র ও মানি রিসিপ্ট প্রদান করা হয়।',
      'প্রকল্পের প্রতিটি চালানের ওজন ও ডেলিভারি স্ট্যাটাস নিয়মিত ড্যাশবোর্ডে আপডেট করা হয়।'
    ],
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534943441045-1089b75eb353?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 'inv-fish-2',
    slug: 'satkhira-khulna-bagda-export-supply',
    stockId: 'fish-2',
    title: 'সাতক্ষীরা ও খুলনা থেকে ৩ টন বাগদা চিংড়ি সংগ্রহ',
    productName: 'ব্ল্যাক টাইগার বাগদা চিংড়ি',
    category: 'চিংড়ি',
    location: 'শ্যামনগর ও পাইকগাছা, খুলনা',
    requiredCapital: 4000000,
    raisedCapital: 3200000,
    minimumInvestment: 100000,
    profitPercentage: 9.0,
    durationDays: 60,
    startDate: '৫ সেপ্টেম্বর ২০২৬',
    settlementDate: '৫ নভেম্বর ২০২৬',
    status: 'open',
    investorCount: 31,
    description: 'খুলনা ও সাতক্ষীরার লবণাক্ত ঘের থেকে সরাসরি ৩ টন এক্সপোর্ট গ্রেডের বাগদা চিংড়ি সংগ্রহ করে সিফুড প্রসেসিং কারখানায় সরবরাহের উচ্চ-মূল্যবান প্রকল্প।',
    procurementPlan: {
      targetQuantity: 3.0,
      unit: 'টন (MT)',
      sourceRegion: 'শ্যামনগর, আশাশুনি ও পাইকগাছা ঘের বেল্ট',
      targetBuyers: 'অনুমোদিত সিফুড এক্সপোর্ট প্রসেসিং প্ল্যান্ট ও ফাইভ-স্টার হোটেল চেইন',
      purchaseWindow: '৫ সেপ্টেম্বর - ১৫ সেপ্টেম্বর ২০২৬',
      salesWindow: '২০ সেপ্টেম্বর - ২৫ অক্টোবর ২০২৬'
    },
    timeline: [
      {
        stage: 1,
        title: 'তহবিল আহ্বান',
        duration: '৮ দিন',
        description: 'অনলাইনে বিনিয়োগ সংগ্রহ চলমান।',
        status: 'active'
      },
      {
        stage: 2,
        title: 'ঘের থেকে সংগ্রহ ও কাউন্ট গ্রেডিং',
        duration: '১৫ দিন',
        description: 'ঘের পয়েন্টে ল্যাব টেস্ট, ওজন ও ১৬/২০ কাউন্ট অনুযায়ী গ্রেডিং।',
        status: 'pending'
      },
      {
        stage: 3,
        title: 'প্রসেসিং প্ল্যান্টে সরবরাহ',
        duration: '২৫ দিন',
        description: 'কারখানায় চালান হস্তান্তর ও এক্সপোর্ট ক্লিয়ারেন্স সম্পন্ন।',
        status: 'pending'
      },
      {
        stage: 4,
        title: 'মুনাফাসহ ৯% লভ্যাংশ বণ্টন',
        duration: '১২ দিন',
        description: 'নির্ধারিত মেয়াদের মধ্যে সরাসরি একাউন্টে অর্থ ফেরত।',
        status: 'pending'
      }
    ],
    risks: [
      'অ্যান্টিবায়োটিক মুক্ত মাছের জন্য পূর্ব-অনুমোদিত ঘের থেকেই শুধুমাত্র সংগ্রহ করা হয়।'
    ],
    securityAndCompliance: [
      '১০০% ব্যাংকিং চ্যানেলে স্বচ্ছ লেনদেন ও অডিট রিপোর্ট প্রদান।'
    ],
    images: [
      'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 'inv-fish-3',
    slug: 'coxsbazar-organic-shutki-batch',
    stockId: 'fish-4',
    title: 'কক্সবাজার নাজিরারটেক থেকে ৫ টন প্রিমিয়াম শুঁটকি সংগ্রহ',
    productName: 'বিষমুক্ত লইট্যা, রূপচাঁদা ও ছুরি শুঁটকি',
    category: 'শুঁটকি',
    location: 'নাজিরারটেক, কক্সবাজার',
    requiredCapital: 2500000,
    raisedCapital: 1950000,
    minimumInvestment: 50000,
    profitPercentage: 8.5,
    durationDays: 60,
    startDate: '১০ সেপ্টেম্বর ২০২৬',
    settlementDate: '১০ নভেম্বর ২০২৬',
    status: 'open',
    investorCount: 22,
    description: 'নাজিরারটেকের ঐতিহ্যবাহী শুঁটকি পল্লী থেকে সরাসরি ৫ টন অর্গানিক শুকনা মাছের বাল্ক লট সংগ্রহ করে ঢাকার কাওরান বাজার ও সুপারমার্কেটে পর্যায়ক্রমে সরবরাহের কম-ঝুঁকিপূর্ণ প্রকল্প।',
    procurementPlan: {
      targetQuantity: 5.0,
      unit: 'টন (MT)',
      sourceRegion: 'নাজিরারটেক শুঁটকি জোন, কক্সবাজার',
      targetBuyers: 'পাইকারি শুঁটকি আড়তদার ও সুপারশপ প্যাকেজিং ভেন্ডর',
      purchaseWindow: '১০ সেপ্টেম্বর - ২০ সেপ্টেম্বর ২০২৬',
      salesWindow: '১ অক্টোবর - ৩০ অক্টোবর ২০২৬'
    },
    timeline: [
      {
        stage: 1,
        title: 'তহবিল সংগ্রহ',
        duration: '১০ দিন',
        description: 'প্রকল্প তহবিল সংগ্রহ।',
        status: 'active'
      },
      {
        stage: 2,
        title: 'শুঁটকি পল্লী থেকে লট ক্রয় ও কোয়ালিটি ড্রায়িং টেস্ট',
        duration: '১৫ দিন',
        description: 'কীটনাশকমুক্ত ও আর্দ্রতা ১২% নিশ্চিত করে ক্রয়।',
        status: 'pending'
      },
      {
        stage: 3,
        title: 'ওয়্যারহাউস স্টোরেজ ও চালান ডেলিভারি',
        duration: '২৫ দিন',
        description: 'ঢাকার পাইকারি ক্রেতাদের নিকট নিয়মিত ডেলিভারি।',
        status: 'pending'
      },
      {
        stage: 4,
        title: 'সেটেলমেন্ট ও মুনাফা প্রদান',
        duration: '১০ দিন',
        description: '৮.৫% প্রফিটসহ বিনিয়োগকারীদের মূলধন ফেরত।',
        status: 'pending'
      }
    ],
    risks: [
      'শুঁটকি শুষ্ক ও দীর্ঘস্থায়ী হওয়ায় কোনো পচন ঝুঁকি নেই।'
    ],
    securityAndCompliance: [
      'ল্যাব টেস্ট সার্টিফিকেট ও চুক্তিভিত্তিক নিরাপত্তা।'
    ],
    images: [
      '/nazirartek-shutki.jpg'
    ]
  },
  {
    id: 'inv-fish-4',
    slug: 'mymensingh-live-rui-katla-supply',
    stockId: 'fish-3',
    title: 'ময়মনসিংহ ও ত্রিশাল থেকে ৫ টন তাজা দেশি মাছ সংগ্রহ',
    productName: 'দেশি রুই, কাতলা ও মৃগেল',
    category: 'দেশি মাছ',
    location: 'ত্রিশাল ও ভালুকা, ময়মনসিংহ',
    requiredCapital: 1500000,
    raisedCapital: 1500000,
    minimumInvestment: 30000,
    profitPercentage: 7.5,
    durationDays: 30,
    startDate: '১৫ আগস্ট ২০২৬',
    settlementDate: '১৫ সেপ্টেম্বর ২০২৬',
    status: 'funded',
    investorCount: 28,
    description: 'ময়মনসিংহের গভীর পুকুর থেকে সংগৃহীত বড় সাইজের রুই-কাতলা মাছ সরাসরি ঢাকার পাইকারি আড়ত ও সুপারশপে সরবরাহের দ্রুততম ৩০ দিনের ঘূর্ণায়মান প্রকল্প। শতভাগ অর্থ সংগৃহীত।',
    procurementPlan: {
      targetQuantity: 5.0,
      unit: 'টন (MT)',
      sourceRegion: 'ত্রিশাল ও ভালুকা, ময়মনসিংহ',
      targetBuyers: 'যাত্রাবাড়ী ও কাওরান বাজার আড়ত এবং সুপারমার্কেট চেইন',
      purchaseWindow: '১৫ আগস্ট - ২০ আগস্ট ২০২৬',
      salesWindow: '২৫ আগস্ট - ১০ সেপ্টেম্বর ২০২৬'
    },
    timeline: [
      {
        stage: 1,
        title: 'তহবিল সংগ্রহ সম্পন্ন',
        duration: '৫ দিন',
        description: 'শতভাগ তহবিল সফলভাবে অর্জিত।',
        status: 'completed'
      },
      {
        stage: 2,
        title: 'মাঠের খামার থেকে জাল দিয়ে আহরণ',
        duration: '১০ দিন',
        description: 'মাছ ধরা ও অক্সিজেন ভ্যানে লোডিং সম্পন্ন।',
        status: 'completed'
      },
      {
        stage: 3,
        title: 'ঢাকায় ডেলিভারি ও বিক্রয় চালান',
        duration: '১০ দিন',
        description: 'বর্তমানে ঢাকা আড়তে ডেলিভারি চলছে।',
        status: 'active'
      },
      {
        stage: 4,
        title: 'মূলধন ও মুনাফা ফেরত',
        duration: '৫ দিন',
        description: 'নির্ধারিত তারিখে অর্থ হস্তান্তর হবে।',
        status: 'pending'
      }
    ],
    risks: [
      'লাইভ অক্সিজেন ভ্যান ও আইস চেইন ব্যবহারের মাধ্যমে শূন্য অপচয় নিশ্চিত।'
    ],
    securityAndCompliance: [
      'স্বচ্ছ হিসাবনিকাশ ও সরাসরি ব্যাংক একাউন্টে সেটেলমেন্ট।'
    ],
    images: [
      'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1200&q=80'
    ]
  }
];
