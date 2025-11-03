"use client";

import { PropsPs } from "@/app/lib/types";

export default function PricingSummary({
  startPrice,
  quantity,
  subtotal,
  taxes,
  total,
  onQuantityChange,
  onConfirm,
  isConfirmDisabled,
}: PropsPs) {
  return (
    <div className="bg-[#EFEFEF] rounded-lg p-6 sticky top-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[#656565]">Starts at</span>
        <span className="text-lg text-[#161616]">₹{startPrice}</span>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-[#656565]">Quantity</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onQuantityChange(-1)}
            disabled={quantity <= 1}
            className="w-6 h-6 border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <span className="text-xs">{quantity}</span>

          <button
            onClick={() => onQuantityChange(1)}
            className="w-6 h-6 border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M10 4a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 0110 4z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
        <div className="flex justify-between text-gray-600 mb-4">
          <span className="text-[#656565]">Subtotal</span>
          <span className="text-sm text-[#161616]">₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-gray-600 mb-4">
          <span className="text-[#656565]">Taxes</span>
          <span className="text-sm text-[#161616]">₹{taxes}</span>
        </div>

      <div className="flex justify-between items-center mb-6 text-xl font-[500] text-[#161616] border-t border-gray-300 pt-4">
        <span >Total</span>
        <span>₹{total}</span>
      </div>

      <button
        onClick={onConfirm}
        disabled={isConfirmDisabled}
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          isConfirmDisabled
            ? "bg-[#D7D7D7] text-[#7F7F7F] cursor-not-allowed font-[500]"
            : "bg-[#FFD643] hover:bg-[#FFCA28] text-[#161616] font-[500]"
        }`}
      >
        Confirm
      </button>
    </div>
  );
}
