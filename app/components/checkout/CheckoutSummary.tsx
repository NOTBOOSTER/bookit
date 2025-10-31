"use client";

interface Props {
  experienceName: string;
  date: string;
  time: string;
  quantity: number;
  subtotal: number;
  taxes: number;
  discount: number;
  total: number;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isDisabled: boolean;
}

export default function CheckoutSummary({
  experienceName,
  date,
  time,
  quantity,
  subtotal,
  taxes,
  discount,
  total,
  onSubmit,
  isSubmitting,
  isDisabled,
}: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "pm" : "am";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${String(displayHour).padStart(2, "0")}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-[#EFEFEF] rounded-xl p-6 sticky top-6">
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-[#656565]">Experience</span>
          <span className="text-[#161616]">{experienceName}</span>
        </div>
        <div className="flex justify-between ">
          <span className="text-[#656565]">Date</span>
          <span className="text-[#161616] text-sm">{formatDate(date)}</span>
        </div>
        <div className="flex justify-between ">
          <span className="text-[#656565]">Time</span>
          <span className="text-[#161616] text-sm">{formatTime(time)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#656565]">Qty</span>
          <span className="text-[#161616] text-sm">{quantity}</span>
        </div>
      </div>

      <div className="border-t border-gray-300 pt-4 space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-[#656565]">Subtotal</span>
          <span className="text-[#161616]">₹{subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#656565]">Taxes</span>
          <span className="text-[#161616] text-sm">₹{taxes}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-₹{discount}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-6 text-xl font-[500] text-[#161616]">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      <button
        onClick={onSubmit}
        disabled={isDisabled || isSubmitting}
        className={`w-full py-3 rounded-lg font-[500] transition-colors ${
          isDisabled || isSubmitting
            ? "bg-[#D7D7D7] text-[#7F7F7F] cursor-not-allowed"
            : "bg-[#FFD643] hover:bg-[#FFCA28] text-[#161616]"
        }`}
      >
        {isSubmitting ? "Processing..." : "Pay and Confirm"}
      </button>
    </div>
  );
}