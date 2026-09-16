import {
  FarmerStockSubmission,
  CorporateRequirement,
  InvestorInterest,
  ContactMessage
} from '../types/forms';

const FARMER_SUBMISSIONS_KEY = 'gangchil_farmer_submissions';
const CORPORATE_REQUIREMENTS_KEY = 'gangchil_corporate_requirements';
const INVESTOR_INTERESTS_KEY = 'gangchil_investor_interests';
const CONTACT_MESSAGES_KEY = 'gangchil_contact_messages';

export const submissionService = {
  /**
   * Submit farmer agricultural stock
   */
  async submitFarmerStock(
    data: Omit<FarmerStockSubmission, 'id' | 'createdAt' | 'status'>
  ): Promise<{ success: boolean; submissionId: string; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const id = `FARM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newSubmission: FarmerStockSubmission = {
      ...data,
      id,
      status: 'submitted',
      createdAt: new Date().toISOString()
    };

    // Save to local storage for Phase 1 persistence
    try {
      const existing = JSON.parse(localStorage.getItem(FARMER_SUBMISSIONS_KEY) || '[]');
      existing.unshift(newSubmission);
      // Keep only 10 recent submissions to prevent localStorage quota exhaustion
      const trimmed = existing.slice(0, 10);
      try {
        localStorage.setItem(FARMER_SUBMISSIONS_KEY, JSON.stringify(trimmed));
      } catch {
        // If quota exceeded, strip large image data URLs to preserve metadata
        const stripped = trimmed.map((sub: FarmerStockSubmission) => ({ ...sub, images: [] }));
        localStorage.setItem(FARMER_SUBMISSIONS_KEY, JSON.stringify(stripped));
      }
    } catch {
      // ignore localStorage errors in non-browser envs
    }

    return {
      success: true,
      submissionId: id,
      message: 'আপনার পণ্যের তথ্য সফলভাবে জমা হয়েছে। Gangchill টিম দ্রুত আপনার সাথে যোগাযোগ করবে।'
    };
  },

  /**
   * Submit corporate buyer stock requirement
   */
  async submitCorporateRequirement(
    data: Omit<CorporateRequirement, 'id' | 'createdAt' | 'status'>
  ): Promise<{ success: boolean; requirementId: string; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const id = `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newReq: CorporateRequirement = {
      ...data,
      id,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem(CORPORATE_REQUIREMENTS_KEY) || '[]');
      existing.unshift(newReq);
      localStorage.setItem(CORPORATE_REQUIREMENTS_KEY, JSON.stringify(existing));
    } catch {
      // ignore
    }

    return {
      success: true,
      requirementId: id,
      message: 'আপনার করপোরেট চাহিদাপত্র গৃহীত হয়েছে। আমাদের সাপ্লাই টিম ২৪ ঘণ্টার মধ্যে যোগাযোগ করবে।'
    };
  },

  /**
   * Submit investor expression of interest
   */
  async submitInvestorInterest(
    data: Omit<InvestorInterest, 'id' | 'createdAt'>
  ): Promise<{ success: boolean; interestId: string; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const id = `INV-INT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newInterest: InvestorInterest = {
      ...data,
      id,
      createdAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem(INVESTOR_INTERESTS_KEY) || '[]');
      existing.unshift(newInterest);
      localStorage.setItem(INVESTOR_INTERESTS_KEY, JSON.stringify(existing));
    } catch {
      // ignore
    }

    return {
      success: true,
      interestId: id,
      message: 'বিনিয়োগের আগ্রহ প্রকাশের জন্য ধন্যবাদ। প্রকল্পের এগ্রিমেন্ট ও পেমেন্ট প্রক্রিয়ার জন্য আমাদের টিম আপনার সাথে যোগাযোগ করবে।'
    };
  },

  /**
   * Submit a general contact message
   */
  async submitContactMessage(
    data: Omit<ContactMessage, 'id' | 'createdAt'>
  ): Promise<{ success: boolean; messageId: string }> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const id = `MSG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newMessage: ContactMessage = {
      ...data,
      id,
      createdAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem(CONTACT_MESSAGES_KEY) || '[]');
      existing.unshift(newMessage);
      const trimmed = existing.slice(0, 20);
      localStorage.setItem(CONTACT_MESSAGES_KEY, JSON.stringify(trimmed));
    } catch {
      // ignore localStorage errors in non-browser envs
    }

    return {
      success: true,
      messageId: id
    };
  }
};
