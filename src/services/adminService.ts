import { Stock, StockStatus } from '../types/stock';
import { MOCK_STOCKS } from '../data/stocks';
import { MOCK_INVESTMENTS } from '../data/investments';
import { MOCK_BLOG_POSTS } from '../data/blog';
import { BlogPost } from '../types/blog';
import { InvestmentOpportunity } from '../types/investment';
import {
  BuyerOrder,
  SellerLot,
  DashboardMetrics,
  ActivityLogItem,
  PlatformSettings,
  OrderStatus
} from '../types/admin';
import { CorporateRequirement, FarmerStockSubmission, InvestorInterest } from '../types/forms';

const ADMIN_STOCKS_KEY = 'gangchill_admin_stocks';
const ADMIN_ORDERS_KEY = 'gangchill_admin_orders';
const ADMIN_SELLER_LOTS_KEY = 'gangchill_admin_seller_lots';
const ADMIN_INVESTMENTS_KEY = 'gangchill_admin_investments';
const ADMIN_BLOG_KEY = 'gangchill_admin_blog';
const ADMIN_ACTIVITY_KEY = 'gangchill_admin_activity';
const ADMIN_SETTINGS_KEY = 'gangchill_admin_settings';

const CORPORATE_REQUIREMENTS_KEY = 'gangchil_corporate_requirements';
const FARMER_SUBMISSIONS_KEY = 'gangchil_farmer_submissions';
const INVESTOR_INTERESTS_KEY = 'gangchil_investor_interests';

// Default initial buyer orders
const INITIAL_BUYER_ORDERS: BuyerOrder[] = [
  {
    id: 'REQ-1726001001',
    companyName: 'ইউনিমার্ট সুপারশপ (গুলশান ২ ব্রাঞ্চ)',
    contactPerson: 'তানভীর আহমেদ',
    phone: '01711-223344',
    email: 'procurement@unimart.com.bd',
    productName: 'চাঁদপুরের পদ্মার রূপালী ইলিশ',
    quantity: 350,
    unit: 'কেজি (KG)',
    requiredDate: '2026-09-20',
    deliveryLocation: 'গুলশান ২, ঢাকা',
    specification: '১ কেজি+ সাইজ গ্রেড, তাজা বরফ প্যাক, নো ফরমালিন সার্টিফিকেট আবশ্যক',
    notes: 'সকাল ৮টার মধ্যে আনলোড নিশ্চিত করতে হবে',
    status: 'pending',
    orderStatus: 'under_review' as OrderStatus,
    quotedPricePerUnit: 1620,
    totalEstimatedValue: 567000,
    assignedStaff: 'মোঃ কামরুল হাসান (অ্যাডমিন)',
    createdAt: '2026-09-14T08:30:00Z',
    statusHistory: [
      { status: 'pending', timestamp: '2026-09-14T08:30:00Z', updatedBy: 'সিস্টেম (ওয়েব ফর্ম)', note: 'ক্রেতা কর্তৃক চাহিদাপত্র জমা' },
      { status: 'under_review' as OrderStatus, timestamp: '2026-09-14T10:15:00Z', updatedBy: 'কামরুল হাসান', note: 'চাঁদপুর বড়স্টেশন ঘাটে লট বরাদ্দ যাচাই চলছে' }
    ]
  },
  {
    id: 'REQ-1726001002',
    companyName: 'রেডিসন ব্লু ঢাকা ওয়াটার গার্ডেন',
    contactPerson: 'শেফ মাহবুবুল আলম',
    phone: '01819-887766',
    email: 'executive.chef@radissondhaka.com',
    productName: 'খুলনা ও সাতক্ষীরার বাগদা চিংড়ি',
    quantity: 150,
    unit: 'কেজি (KG)',
    requiredDate: '2026-09-18',
    deliveryLocation: 'বিমানবন্দর রোড, ঢাকা',
    specification: '১৬/২০ কাউন্ট এক্সপোর্ট গ্রেড, হেড-অন শেল-অন (HOSO), সম্পূর্ণ ফ্রেশ',
    notes: 'রেফার ভ্যানে তাপমাত্রা -২° সে.-এ রাখা দরকার',
    status: 'reviewed',
    orderStatus: 'confirmed',
    quotedPricePerUnit: 980,
    totalEstimatedValue: 147000,
    assignedStaff: 'কামরুল হাসান',
    createdAt: '2026-09-13T14:20:00Z',
    statusHistory: [
      { status: 'pending', timestamp: '2026-09-13T14:20:00Z', updatedBy: 'সিস্টেম' },
      { status: 'confirmed', timestamp: '2026-09-14T11:00:00Z', updatedBy: 'কামরুল হাসান', note: 'অফিশিয়াল পারচেজ অর্ডার কনফার্মড' }
    ]
  },
  {
    id: 'REQ-1726001003',
    companyName: 'স্বপ্ন সুপারশপ (বনানী আউটলেট)',
    contactPerson: 'ফারহান চৌধুরী',
    phone: '01912-334455',
    email: 'farhan@shwapno.net',
    productName: 'নাটোর চলনবিলের তাজা পাবদা মাছ',
    quantity: 200,
    unit: 'কেজি (KG)',
    requiredDate: '2026-09-22',
    deliveryLocation: 'তেজগাঁও সেন্ট্রাল ডিসি, ঢাকা',
    specification: 'মিডিয়াম সাইজ (৬০-৭০ গ্রাম/পিস), চলনবিলের জ্যান্ত সংগ্রহ',
    status: 'pending',
    orderStatus: 'pending',
    createdAt: '2026-09-15T09:10:00Z',
    statusHistory: [
      { status: 'pending', timestamp: '2026-09-15T09:10:00Z', updatedBy: 'সিস্টেম' }
    ]
  }
];

// Default initial seller submissions
const INITIAL_SELLER_LOTS: SellerLot[] = [
  {
    id: 'FARM-1726002001',
    farmerName: 'মো: মোশাররফ হোসেন (জেলে সমবায়)',
    phone: '01715-998877',
    district: 'চাঁদপুর',
    location: 'বড়স্টেশন মোহনা ঘাট',
    productName: 'পদ্মার তাজা বড় ইলিশ (১.২ কেজি+)',
    stockType: 'current',
    quantity: 800,
    unit: 'কেজি (KG)',
    availabilityDate: '2026-09-16',
    expectedPrice: 1500,
    description: 'আজ ভোরের মেঘনা মোহনার টাটকা আহরণ। বরফ ক্রেটে সুরক্ষিত।',
    status: 'submitted',
    verificationStatus: 'verified',
    fieldInspectorName: 'আব্দুল কাদের (চাঁদপুর হাব)',
    inspectionNotes: 'মাছের কোয়ালিটি এক্সিলেন্ট। পেট অক্ষত, আঁশ ঝকঝকে।',
    createdAt: '2026-09-14T06:45:00Z'
  },
  {
    id: 'FARM-1726002002',
    farmerName: 'হাজী রফিকুল ইসলাম ঘের প্রজেক্ট',
    phone: '01812-445566',
    district: 'সাতক্ষীরা',
    location: 'শ্যামনগর সুন্দরবন সংলগ্ন ঘের',
    productName: 'সুন্দরবনের অর্গানিক গলদা ও বাগদা চিংড়ি',
    stockType: 'upcoming',
    quantity: 1.5,
    unit: 'টন (MT)',
    availabilityDate: '2026-09-25',
    expectedPrice: 850,
    description: 'সামনের অমাবস্যার জোতে ঘের থেকে তোলা হবে। অগ্রিম বায়ার প্রয়োজন।',
    status: 'submitted',
    verificationStatus: 'pending',
    createdAt: '2026-09-15T07:15:00Z'
  }
];

// Default platform settings
const INITIAL_SETTINGS: PlatformSettings = {
  platformName: 'Gangchill (গাংচিল) — পাইকারি মাছের বাণিজ্যিক প্ল্যাটফর্ম',
  supportPhone: '+880 1700-000000',
  supportEmail: 'trade@gangchill.com',
  headOfficeAddress: 'প্লট ১২, ব্লক-সি, গুলশান-১, ঢাকা ১২১২, বাংলাদেশ',
  hubLocations: 'চাঁদপুর (বড়স্টেশন), খুলনা (রূপসা), কক্সবাজার (ফিশারি ঘাট), নাটোর',
  defaultMoqKg: 50,
  coldChainEnabled: true,
  allowPublicSellerSubmissions: true,
  allowPublicInvestorInterest: true,
  maintenanceMode: false
};

export const adminService = {
  // -------------------------------------------------------------
  // 1. STOCKS MANAGEMENT (CRUD)
  // -------------------------------------------------------------
  getStocks(): Stock[] {
    try {
      const stored = localStorage.getItem(ADMIN_STOCKS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [...MOCK_STOCKS];
  },

  getStockById(id: string): Stock | null {
    const stocks = this.getStocks();
    return stocks.find((s) => s.id === id || s.slug === id) || null;
  },

  saveStocks(stocks: Stock[]): void {
    localStorage.setItem(ADMIN_STOCKS_KEY, JSON.stringify(stocks));
  },

  createStock(stockData: Omit<Stock, 'id'>): Stock {
    const stocks = this.getStocks();
    const id = `fish-${Date.now()}`;
    const newStock: Stock = { ...stockData, id };
    stocks.unshift(newStock);
    this.saveStocks(stocks);
    this.logAction('নতুন মাছের স্টক পোস্ট তৈরি', 'stock', newStock.banglaName, `${newStock.quantity} ${newStock.unit} (${newStock.location})`);
    return newStock;
  },

  updateStock(id: string, updates: Partial<Stock>): Stock | null {
    const stocks = this.getStocks();
    const index = stocks.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const updated = { ...stocks[index], ...updates };
    stocks[index] = updated;
    this.saveStocks(stocks);
    this.logAction('স্টক আপডেট করা হয়েছে', 'stock', updated.banglaName, `স্ট্যাটাস: ${updated.status}, মূল্য: ৳${updated.price || 0}`);
    return updated;
  },

  deleteStock(id: string): boolean {
    const stocks = this.getStocks();
    const target = stocks.find((s) => s.id === id);
    const filtered = stocks.filter((s) => s.id !== id);
    if (filtered.length === stocks.length) return false;

    this.saveStocks(filtered);
    if (target) {
      this.logAction('স্টক পোস্ট অপসারণ', 'stock', target.banglaName, `ID: ${id}`);
    }
    return true;
  },

  toggleStockStatus(id: string, newStatus: StockStatus): Stock | null {
    return this.updateStock(id, { status: newStatus });
  },

  // -------------------------------------------------------------
  // 2. BUYER ORDERS & REQUIREMENTS MANAGEMENT
  // -------------------------------------------------------------
  getBuyerOrders(): BuyerOrder[] {
    let orders: BuyerOrder[] = [];
    try {
      const stored = localStorage.getItem(ADMIN_ORDERS_KEY);
      if (stored) {
        orders = JSON.parse(stored);
      } else {
        orders = [...INITIAL_BUYER_ORDERS];
      }
    } catch {
      orders = [...INITIAL_BUYER_ORDERS];
    }

    // Merge any live submissions from user-end modal (localStorage)
    try {
      const userSubs: CorporateRequirement[] = JSON.parse(localStorage.getItem(CORPORATE_REQUIREMENTS_KEY) || '[]');
      userSubs.forEach((sub) => {
        if (!orders.some((o) => o.id === sub.id)) {
          orders.unshift({
            ...sub,
            orderStatus: (sub.status === 'reviewed' ? 'quoted' : 'pending') as OrderStatus,
            statusHistory: [
              { status: 'pending', timestamp: sub.createdAt || new Date().toISOString(), updatedBy: 'ওয়েবসাইট ইউজার' }
            ]
          });
        }
      });
    } catch {
      // ignore
    }

    return orders;
  },

  getOrderById(id: string): BuyerOrder | null {
    const orders = this.getBuyerOrders();
    return orders.find((o) => o.id === id) || null;
  },

  saveBuyerOrders(orders: BuyerOrder[]): void {
    localStorage.setItem(ADMIN_ORDERS_KEY, JSON.stringify(orders));
  },

  updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string, actor = 'অ্যাডমিন'): BuyerOrder | null {
    const orders = this.getBuyerOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    const order = orders[index];
    const historyItem = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      updatedBy: actor,
      note: note || `অর্ডার স্ট্যাটাস পরিবর্তিত: ${newStatus}`
    };

    order.orderStatus = newStatus;
    order.status = (newStatus === 'completed' || newStatus === 'confirmed' ? 'reviewed' : 'pending');
    order.statusHistory = [historyItem, ...(order.statusHistory || [])];

    orders[index] = order;
    this.saveBuyerOrders(orders);
    this.logAction('অর্ডার স্ট্যাটাস আপডেট', 'order', `${order.companyName} (${order.productName})`, `নতুন স্ট্যাটাস: ${newStatus}`);
    return order;
  },

  addOrderInternalNote(orderId: string, text: string, author = 'অ্যাডমিন'): BuyerOrder | null {
    const orders = this.getBuyerOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    const order = orders[index];
    const newNote = {
      id: `note-${Date.now()}`,
      author,
      text,
      createdAt: new Date().toISOString()
    };

    order.internalNotesList = [newNote, ...(order.internalNotesList || [])];
    orders[index] = order;
    this.saveBuyerOrders(orders);
    return order;
  },

  updateOrderQuote(orderId: string, quotedPricePerUnit: number): BuyerOrder | null {
    const orders = this.getBuyerOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    const order = orders[index];
    order.quotedPricePerUnit = quotedPricePerUnit;
    order.totalEstimatedValue = Math.round(quotedPricePerUnit * order.quantity);
    if (order.orderStatus === 'pending') {
      order.orderStatus = 'quoted';
    }

    orders[index] = order;
    this.saveBuyerOrders(orders);
    this.logAction('কোটেশন প্রাইস আপডেট', 'order', order.companyName, `দর: ৳${quotedPricePerUnit}/${order.unit}, মোট: ৳${order.totalEstimatedValue}`);
    return order;
  },

  // -------------------------------------------------------------
  // 3. SELLER LOTS & SOURCING MANAGEMENT
  // -------------------------------------------------------------
  getSellerLots(): SellerLot[] {
    let lots: SellerLot[] = [];
    try {
      const stored = localStorage.getItem(ADMIN_SELLER_LOTS_KEY);
      if (stored) {
        lots = JSON.parse(stored);
      } else {
        lots = [...INITIAL_SELLER_LOTS];
      }
    } catch {
      lots = [...INITIAL_SELLER_LOTS];
    }

    // Merge live submissions from /sell
    try {
      const userSubs: FarmerStockSubmission[] = JSON.parse(localStorage.getItem(FARMER_SUBMISSIONS_KEY) || '[]');
      userSubs.forEach((sub) => {
        if (!lots.some((l) => l.id === sub.id)) {
          lots.unshift({
            ...sub,
            verificationStatus: 'pending'
          });
        }
      });
    } catch {
      // ignore
    }

    return lots;
  },

  getSellerLotById(id: string): SellerLot | null {
    const lots = this.getSellerLots();
    return lots.find((l) => l.id === id) || null;
  },

  saveSellerLots(lots: SellerLot[]): void {
    localStorage.setItem(ADMIN_SELLER_LOTS_KEY, JSON.stringify(lots));
  },

  updateSellerLotStatus(lotId: string, status: 'pending' | 'verified' | 'approved' | 'rejected', notes?: string): SellerLot | null {
    const lots = this.getSellerLots();
    const index = lots.findIndex((l) => l.id === lotId);
    if (index === -1) return null;

    const lot = lots[index];
    lot.verificationStatus = status;
    if (notes) lot.inspectionNotes = notes;

    lots[index] = lot;
    this.saveSellerLots(lots);
    this.logAction('ঘাট সরবরাহ যাচাই আপডেট', 'seller_lot', `${lot.farmerName} (${lot.productName})`, `স্ট্যাটাস: ${status}`);
    return lot;
  },

  convertLotToStock(lotId: string, stockOverrides?: Partial<Stock>): Stock | null {
    const lot = this.getSellerLotById(lotId);
    if (!lot) return null;

    const createdStock = this.createStock({
      slug: `${lot.productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      productName: lot.productName,
      banglaName: lot.productName,
      category: 'দেশি মাছ',
      status: lot.stockType === 'current' ? 'live' : 'upcoming',
      quantity: lot.quantity,
      unit: lot.unit,
      location: lot.location,
      district: lot.district,
      division: 'বিভাগ',
      availabilityDate: lot.availabilityDate || 'আজকের তাজা সংগ্রহ',
      grade: 'ফিল্ড ভেরিফাইড গ্রেড A',
      packaging: 'ইনসুলেটেড আইস ক্রেট',
      price: lot.expectedPrice || 0,
      description: lot.description || `${lot.district} অঞ্চল থেকে সরাসরি সংগৃহীত।`,
      images: lot.images && lot.images.length > 0 ? lot.images : ['/hero-fishermen-boat.png'],
      ...stockOverrides
    });

    // Mark lot as approved & link stock
    const lots = this.getSellerLots();
    const idx = lots.findIndex((l) => l.id === lotId);
    if (idx !== -1) {
      lots[idx].verificationStatus = 'approved';
      lots[idx].convertedStockId = createdStock.id;
      this.saveSellerLots(lots);
    }

    this.logAction('সরবরাহ লট থেকে স্টক তৈরি', 'stock', createdStock.banglaName, `লট ID: ${lotId} -> স্টক ID: ${createdStock.id}`);
    return createdStock;
  },

  // -------------------------------------------------------------
  // 4. PROCUREMENT FUNDS & INVESTOR INTERESTS
  // -------------------------------------------------------------
  getInvestments(): InvestmentOpportunity[] {
    try {
      const stored = localStorage.getItem(ADMIN_INVESTMENTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [...MOCK_INVESTMENTS];
  },

  saveInvestments(investments: InvestmentOpportunity[]): void {
    localStorage.setItem(ADMIN_INVESTMENTS_KEY, JSON.stringify(investments));
  },

  updateInvestmentStatus(id: string, status: 'open' | 'funded' | 'closed'): InvestmentOpportunity | null {
    const list = this.getInvestments();
    const idx = list.findIndex((i) => i.id === id);
    if (idx === -1) return null;

    list[idx].status = status;
    this.saveInvestments(list);
    this.logAction('তহবিল প্রকল্পের স্ট্যাটাস পরিবর্তন', 'investment', list[idx].title, `নতুন স্ট্যাটাস: ${status}`);
    return list[idx];
  },

  createInvestment(opportunity: InvestmentOpportunity): InvestmentOpportunity {
    const list = this.getInvestments();
    list.unshift(opportunity);
    this.saveInvestments(list);
    this.logAction('নতুন তহবিল প্রকল্প তৈরি', 'investment', opportunity.title, `টার্গেট ক্যাপিটাল: ৳${opportunity.requiredCapital.toLocaleString('bn-BD')}`);
    return opportunity;
  },

  updateInvestment(id: string, updates: Partial<InvestmentOpportunity>): InvestmentOpportunity | null {
    const list = this.getInvestments();
    const idx = list.findIndex((i) => i.id === id);
    if (idx === -1) return null;

    list[idx] = { ...list[idx], ...updates };
    this.saveInvestments(list);
    this.logAction('তহবিল প্রকল্প আপডেট', 'investment', list[idx].title);
    return list[idx];
  },

  deleteInvestment(id: string): boolean {
    const list = this.getInvestments();
    const target = list.find((i) => i.id === id);
    const filtered = list.filter((i) => i.id !== id);
    if (filtered.length === list.length) return false;

    this.saveInvestments(filtered);
    if (target) {
      this.logAction('তহবিল প্রকল্প মুছে ফেলা', 'investment', target.title);
    }
    return true;
  },

  getInvestorInterests(): InvestorInterest[] {
    try {
      const stored = localStorage.getItem(INVESTOR_INTERESTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    const INITIAL_INTERESTS: InvestorInterest[] = [
      {
        id: 'INV-1726005001',
        opportunityId: 'hilsa-procurement-chandpur-2026',
        opportunityTitle: 'পদ্মার রূপালী ইলিশ সংগ্রহ তহবিল (চাঁদপুর বড়স্টেশন)',
        investorName: 'ইঞ্জি. তারেকুর রহমান',
        phone: '01712-887766',
        email: 'tariqur.eng@gmail.com',
        interestedAmount: 250000,
        notes: '৬ মাসের মেয়াদে অংশ নিতে চাই। এগ্রিমেন্ট ড্রাফট হোয়াটসঅ্যাপে দিন।',
        expectedProfit: 35000,
        createdAt: '2026-09-14T11:20:00Z'
      },
      {
        id: 'INV-1726005002',
        opportunityId: 'shrimp-hub-khulna-2026',
        opportunityTitle: 'খুলনা ও সাতক্ষীরা বাগদা চিংড়ি প্রসেসিং ও কোল্ড চেইন',
        investorName: 'ড. কামরুন্নাহার শিলা',
        phone: '01911-332211',
        email: 'dr.sheela.kh@yahoo.com',
        interestedAmount: 500000,
        notes: 'কোল্ড স্টোরেজ ব্যাকড সিকিউরিটি ডিড নিশ্চিত হলে পুরো ফান্ডিং করতে প্রস্তুত।',
        expectedProfit: 75000,
        createdAt: '2026-09-13T16:45:00Z'
      },
      {
        id: 'INV-1726005003',
        opportunityId: 'marine-deepsea-coxsbazar-2026',
        opportunityTitle: 'কক্সবাজার গভীর সমুদ্র ট্রলার কনসোর্টিয়াম তহবিল',
        investorName: 'মাহফুজুর রহমান (গ্রিন ক্যাপিটাল)',
        phone: '01819-556677',
        email: 'invest@greencapital.com.bd',
        interestedAmount: 1000000,
        notes: 'প্রাথমিক আলোচনার জন্য বনানী অফিসে সরাসরি মিটিং করতে আগ্রহী।',
        expectedProfit: 160000,
        createdAt: '2026-09-15T09:00:00Z'
      }
    ];
    localStorage.setItem(INVESTOR_INTERESTS_KEY, JSON.stringify(INITIAL_INTERESTS));
    return INITIAL_INTERESTS;
  },

  saveInvestorInterests(interests: InvestorInterest[]): void {
    localStorage.setItem(INVESTOR_INTERESTS_KEY, JSON.stringify(interests));
  },

  deleteInvestorInterest(id: string): boolean {
    const list = this.getInvestorInterests();
    const filtered = list.filter((i) => i.id !== id);
    if (filtered.length === list.length) return false;
    this.saveInvestorInterests(filtered);
    this.logAction('বিনিয়োগকারীর আবেদন মুছে ফেলা', 'investment', `ID: ${id}`);
    return true;
  },

  // -------------------------------------------------------------
  // 5. BLOG ARTICLES MANAGEMENT
  // -------------------------------------------------------------
  getBlogPosts(): BlogPost[] {
    try {
      const stored = localStorage.getItem(ADMIN_BLOG_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [...MOCK_BLOG_POSTS];
  },

  saveBlogPosts(posts: BlogPost[]): void {
    localStorage.setItem(ADMIN_BLOG_KEY, JSON.stringify(posts));
  },

  createBlogPost(postData: BlogPost): BlogPost {
    const posts = this.getBlogPosts();
    posts.unshift(postData);
    this.saveBlogPosts(posts);
    this.logAction('নতুন ব্লগ আর্টিকেল প্রকাশ', 'blog', postData.title, `ক্যাটাগরি: ${postData.category}`);
    return postData;
  },

  updateBlogPost(slug: string, updates: Partial<BlogPost>): BlogPost | null {
    const posts = this.getBlogPosts();
    const index = posts.findIndex((p) => p.slug === slug);
    if (index === -1) return null;

    const updated = { ...posts[index], ...updates, updatedAt: new Date().toISOString().split('T')[0] };
    posts[index] = updated;
    this.saveBlogPosts(posts);
    this.logAction('ব্লগ আর্টিকেল আপডেট', 'blog', updated.title, `Slug: ${slug}`);
    return updated;
  },

  deleteBlogPost(slug: string): boolean {
    const posts = this.getBlogPosts();
    const target = posts.find((p) => p.slug === slug);
    const filtered = posts.filter((p) => p.slug !== slug);
    if (filtered.length === posts.length) return false;

    this.saveBlogPosts(filtered);
    if (target) {
      this.logAction('ব্লগ আর্টিকেল মুছে ফেলা', 'blog', target.title, `Slug: ${slug}`);
    }
    return true;
  },

  // -------------------------------------------------------------
  // 6. ACTIVITY LOGS
  // -------------------------------------------------------------
  getActivityLogs(): ActivityLogItem[] {
    try {
      const stored = localStorage.getItem(ADMIN_ACTIVITY_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [
      {
        id: 'act-1',
        action: 'অর্ডার পর্যালোচনা',
        targetType: 'order',
        targetTitle: 'ইউনিমার্ট সুপারশপ (চাঁদপুরের ইলিশ)',
        actor: 'কামরুল হাসান',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        details: 'কোটেশন প্রাইস ৳১৬২০/কেজি চূড়ান্ত'
      },
      {
        id: 'act-2',
        action: 'নতুন মাছের লট যুক্ত',
        targetType: 'stock',
        targetTitle: 'চাঁদপুরের পদ্মার রূপালী ইলিশ',
        actor: 'কামরুল হাসান',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        details: '১.২ টন লাইভ স্টকে প্রকাশ'
      }
    ];
  },

  logAction(action: string, targetType: ActivityLogItem['targetType'], targetTitle: string, details?: string, actor = 'কামরুল হাসান'): void {
    const logs = this.getActivityLogs();
    const newLog: ActivityLogItem = {
      id: `act-${Date.now()}`,
      action,
      targetType,
      targetTitle,
      actor,
      timestamp: new Date().toISOString(),
      details
    };
    logs.unshift(newLog);
    localStorage.setItem(ADMIN_ACTIVITY_KEY, JSON.stringify(logs.slice(0, 30)));
  },

  // -------------------------------------------------------------
  // 7. DASHBOARD METRICS
  // -------------------------------------------------------------
  getDashboardMetrics(): DashboardMetrics {
    const stocks = this.getStocks();
    const orders = this.getBuyerOrders();
    const lots = this.getSellerLots();
    const investments = this.getInvestments();
    const investorInterests = this.getInvestorInterests();

    const liveStocks = stocks.filter((s) => s.status === 'live').length;
    const upcomingStocks = stocks.filter((s) => s.status === 'upcoming').length;
    const soldStocks = stocks.filter((s) => s.status === 'sold').length;

    const pendingRequirementsCount = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'under_review').length;
    const activeOrdersCount = orders.filter((o) => o.orderStatus === 'confirmed' || o.orderStatus === 'processing' || o.orderStatus === 'dispatched').length;
    const completedOrdersCount = orders.filter((o) => o.orderStatus === 'completed').length;

    const pendingSellerLotsCount = lots.filter((l) => l.verificationStatus === 'pending').length;

    const totalInvestmentPledges = investorInterests.length;
    const totalPledgedAmount = investorInterests.reduce((sum, item) => sum + (item.interestedAmount || 0), 0);
    const activeFundProjectsCount = investments.filter((i) => i.status === 'open').length;

    return {
      totalStocks: stocks.length,
      liveStocks,
      upcomingStocks,
      soldStocks,
      pendingRequirementsCount,
      activeOrdersCount,
      completedOrdersCount,
      pendingSellerLotsCount,
      totalInvestmentPledges,
      totalPledgedAmount,
      activeFundProjectsCount
    };
  },

  // -------------------------------------------------------------
  // 8. SETTINGS
  // -------------------------------------------------------------
  getSettings(): PlatformSettings {
    try {
      const stored = localStorage.getItem(ADMIN_SETTINGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return { ...INITIAL_SETTINGS };
  },

  saveSettings(settings: PlatformSettings): void {
    localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings));
    this.logAction('প্ল্যাটফর্ম সেটিংস আপডেট', 'settings', 'জেনারেল কনফিগারেশন', 'সাপোর্ট ফোন ও হাবের তথ্য সংশোধিত');
  }
};
