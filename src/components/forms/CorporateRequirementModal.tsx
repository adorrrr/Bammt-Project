import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { FormField } from './FormField';
import { SelectField } from './SelectField';
import { Textarea } from './Textarea';
import { Button } from '../common/Button';
import { SuccessState } from '../common/SuccessState';
import { submissionService } from '../../services/submissionService';
import { Stock } from '../../types/stock';
import { normalizeBanglaToEnglishDigits } from '../../utils/formatters';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface CorporateRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledStock?: Stock | null;
}

export const CorporateRequirementModal: React.FC<CorporateRequirementModalProps> = ({
  isOpen,
  onClose,
  prefilledStock
}) => {
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [productName, setProductName] = useState(prefilledStock ? prefilledStock.banglaName : '');
  const [quantity, setQuantity] = useState(prefilledStock ? prefilledStock.minimumOrder?.toString() || '100' : '');
  const [unit, setUnit] = useState('কেজি (KG)');
  const [requiredDate, setRequiredDate] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [specification, setSpecification] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useFocusTrap(dialogRef, isOpen);

  // Re-sync the pre-filled product/quantity fields whenever the underlying
  // stock changes. Without this, navigating client-side from one stock's
  // detail page to another (without a full page reload) left this modal
  // showing the previous stock's product name and quantity.
  useEffect(() => {
    setProductName(prefilledStock ? prefilledStock.banglaName : '');
    setQuantity(prefilledStock ? prefilledStock.minimumOrder?.toString() || '100' : '');
    setErrors({});
  }, [prefilledStock?.id]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleResetAndClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!companyName.trim()) errs.companyName = 'আপনার প্রতিষ্ঠানের নাম লিখুন';
    if (!contactPerson.trim()) errs.contactPerson = 'যোগাযোগকারীর নাম লিখুন';
    const normalizedPhone = normalizeBanglaToEnglishDigits(phone.replace(/[\s-]/g, ''));
    if (!phone.trim()) {
      errs.phone = 'যোগাযোগের মোবাইল নম্বর দিন';
    } else if (!/^01[3-9]\d{8}$/.test(normalizedPhone)) {
      errs.phone = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)';
    }
    if (!productName.trim()) errs.productName = 'কোন মাছ প্রয়োজন উল্লেখ করুন';
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      errs.quantity = 'প্রয়োজনীয় পরিমাণ লিখুন';
    }
    if (!deliveryLocation.trim()) errs.deliveryLocation = 'কোথায় ডেলিভারি লাগবে লিখুন';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await submissionService.submitCorporateRequirement({
        companyName,
        contactPerson,
        phone,
        email: email.trim() || undefined,
        productName,
        quantity: Number(quantity),
        unit,
        requiredDate: requiredDate || undefined,
        deliveryLocation,
        specification: specification.trim() || undefined,
        notes: notes.trim() || undefined
      });

      if (res.success) {
        setSubmittedId(res.requirementId);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedId(null);
    onClose();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="corporate-requirement-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in text-gangchill-ink"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-xl bg-white border border-gangchill-ink/10 rounded-2xl sm:rounded-3xl overflow-hidden my-auto max-h-[calc(100vh-1.25rem)] max-h-[calc(100dvh-1.25rem)] sm:max-h-[88dvh] flex flex-col shadow-2xl outline-none"
      >
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 bg-gradient-to-r from-gangchill-canvas via-white to-gangchill-canvas/50 border-b border-gangchill-ink/10 flex items-center justify-between shrink-0 gap-3">
          <div className="min-w-0 flex-1">
            <h3
              id="corporate-requirement-modal-title"
              className="font-bold text-lg sm:text-xl font-serifBangla text-gangchill-green-deep leading-snug"
            >
              {prefilledStock ? 'এই মাছের স্টকের জন্য চাহিদা দিন' : 'মাছের করপোরেট চাহিদা জানান'}
            </h3>
            <p className="text-xs text-gangchill-ink/60 mt-0.5 leading-normal">
              হোলসেল, সুপারশপ ও সিফুড প্রসেসিং কারখানার জন্য
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gangchill-ink/60 hover:text-gangchill-ink hover:bg-black/5 active:scale-95 transition-all shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 pb-6 sm:pb-8 overflow-y-auto overscroll-contain flex-1 min-h-0 scroll-py-3">
          {submittedId ? (
            <SuccessState
              title="চাহিদাপত্র সফলভাবে জমা হয়েছে!"
              message="আপনার মাছের চাহিদাপত্রটি আমাদের সোর্সিং টিমের কাছে পৌঁছেছে। আমাদের প্রতিনিধি দ্রুত যোগাযোগ করে ঘাট/ঘেরের রেট ও স্যাম্পল নিশ্চিত করবে।"
              referenceId={submittedId}
              actionLabel="ঠিক আছে"
              onAction={handleResetAndClose}
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <FormField
                  label="আপনার কোম্পানির নাম"
                  required
                  placeholder="যেমন: স্বপ্ন সুপারশপ / বেঙ্গল সিফুড"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  error={errors.companyName}
                />
                <FormField
                  label="যোগাযোগকারী ব্যক্তি (নাম ও পদবী)"
                  required
                  placeholder="যেমন: আরিফুল ইসলাম, প্রকিউরমেন্ট ম্যানেজার"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  error={errors.contactPerson}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <FormField
                  label="যোগাযোগের নম্বর"
                  required
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={errors.phone}
                />
                <FormField
                  label="ইমেইল (ঐচ্ছিক)"
                  type="email"
                  placeholder="procurement@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <FormField
                    label="কোন মাছ প্রয়োজন?"
                    required
                    placeholder="যেমন: চাঁদপুরের পদ্মার ইলিশ / বাগদা চিংড়ি"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    error={errors.productName}
                  />
                </div>
                <div className="sm:col-span-1">
                  <FormField
                    label="কত পরিমাণ প্রয়োজন?"
                    required
                    type="number"
                    min="1"
                    placeholder="৫০০"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    error={errors.quantity}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <SelectField
                  label="একক"
                  options={['কেজি (KG)', 'টন (MT)', 'মণ', 'কার্টন/বক্স']}
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                />
                <FormField
                  label="কবে প্রয়োজন? (ডেলিভারি তারিখ)"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                />
              </div>

              <FormField
                label="কোথায় ডেলিভারি লাগবে?"
                required
                placeholder="যেমন: তেজগাঁও সেন্ট্রাল ওয়্যারহাউস, ঢাকা"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                error={errors.deliveryLocation}
              />

              <Textarea
                label="মাছের সাইজ, গ্রেড বা প্যাকেজিং শর্ত (ঐচ্ছিক)"
                placeholder="যেমন: ইলিশ ১ কেজি+ সাইজ, বরফে ড্রাম ডেলিভারি, চিংড়ি ১৬/২০ কাউন্ট..."
                rows={2}
                value={specification}
                onChange={(e) => setSpecification(e.target.value)}
              />

              <Textarea
                label="অতিরিক্ত কোনো তথ্য (ঐচ্ছিক)"
                placeholder="পেমেন্ট টার্মস বা অন্য কোনো বিশেষ অনুরোধ..."
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <div className="pt-4 mt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 border-t border-gangchill-ink/10">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto"
                >
                  বাতিল
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={loading}
                  className="w-full sm:w-auto"
                >
                  চাহিদাপত্র জমা দিন
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
