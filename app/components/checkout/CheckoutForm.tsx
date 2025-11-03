"use client";

interface Props {
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  promoCode: string;
  setPromoCode: (value: string) => void;
  agreedToTerms: boolean;
  setAgreedToTerms: (value: boolean) => void;
  discount: number;
  onApplyPromo: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function CheckoutForm({
  fullName,
  setFullName,
  email,
  setEmail,
  promoCode,
  setPromoCode,
  agreedToTerms,
  setAgreedToTerms,
  discount,
  onApplyPromo,
  onSubmit,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-[#EFEFEF] p-5 rounded-xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-[#5B5B5B] mb-2">Full name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            required
            className="w-full px-4 py-2 bg-[#DDDDDD] rounded text-sm focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-[#5B5B5B] mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="w-full px-4 py-2 bg-[#DDDDDD] rounded text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Promo code"
          disabled={discount > 0}
          className="flex-1 px-4 py-2 bg-[#DDDDDD] rounded text-sm focus:outline-none disabled:opacity-50"
        />
        <button
          type="button"
          onClick={onApplyPromo}
          disabled={discount > 0 || !promoCode.trim()}
          className="px-6 py-2 bg-[#161616] text-white rounded text-sm hover:bg-gray-800 disabled:opacity-50"
        >
          Apply
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="terms"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="w-3 h-3 accent-[#161616]"
        />
        <label htmlFor="terms" className="text-xs text-[#838383]">
          I agree to the terms and safety policy
        </label>
      </div>
    </form>
  );
}