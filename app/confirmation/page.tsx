"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingRef = searchParams.get("ref");

  useEffect(() => {
    if (!bookingRef) {
      router.push("/");
    }
  }, [bookingRef, router]);

  if (!bookingRef) return null;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[#161616]">
          Booking Confirmed
        </h1>
        
        <p className="text-[#656565] mb-8">
          Ref ID: {bookingRef}
        </p>

        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-[#E3E3E3] text-[#656565] rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        Loading...
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}