"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CheckoutSummary from "@/app/components/checkout/CheckoutSummary";
import CheckoutForm from "@/app/components/checkout/CheckoutForm";
import { BookingData } from "@/app/lib/types";
import Logger from "@/app/lib/logger";

const logger = new Logger("CLIENT");

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discount, setDiscount] = useState(0);

  const experienceId = searchParams.get("experienceId");
  const slotId = searchParams.get("slotId");
  const quantity = parseInt(searchParams.get("quantity") || "1");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    if (!experienceId || !slotId) {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/experiences?id=${experienceId}`);
        const data = await res.json();
        
        const slot = data.slots.find((s: { id: number }) => s.id === parseInt(slotId));
        
        const subtotal = data.experience.price * quantity;
        const taxes = Math.round(subtotal * 0.05);
        
        setBookingData({
          experience: data.experience,
          slot,
          quantity,
          subtotal,
          taxes,
          total: subtotal + taxes
        });
        setLoading(false);
      } catch (error) {
        console.error(error);
        router.push("/");
      }
    };

    fetchData();
  }, [experienceId, slotId, quantity, router, baseUrl]);

  const handleApplyPromo = async () => {
    if (!promoCode.trim() || !bookingData) return;

    try {
      const res = await fetch(`${baseUrl}/api/promo/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode }),
      });

      if (res.ok) {
        const promo = await res.json();
        let discountAmount = 0;

        if (promo.discount_type === "percentage") {
          discountAmount = Math.round(bookingData.subtotal * (promo.discount_value / 100));
        } else {
          discountAmount = promo.discount_value;
        }

        setDiscount(discountAmount);
      } else {
        alert("Invalid promo code");
      }
    } catch (error) {
      alert("Failed to apply promo");
      logger.error("Error applying promo:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      alert("Please agree to terms");
      return;
    }

    if (!bookingData) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`${baseUrl}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience_id: bookingData.experience.id,
          slot_id: bookingData.slot.id,
          user_name: fullName,
          email,
          quantity,
          promo_code: discount > 0 ? promoCode : null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/confirmation?ref=${data.booking_ref}`);
      } else {
        alert("Booking failed");
      }
    } catch (error) {
      alert("Error creating booking");
      logger.error("Error creating booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
  }

  if (!bookingData) return null;

  const finalTotal = bookingData.total - discount;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-700 mb-6">
          <span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.8334 9.16667H6.5251L10.5918 5.1C10.9168 4.775 10.9168 4.24167 10.5918 3.91667C10.5147 3.83942 10.4231 3.77813 10.3223 3.73631C10.2215 3.69449 10.1134 3.67297 10.0043 3.67297C9.89513 3.67297 9.78706 3.69449 9.68625 3.73631C9.58544 3.77813 9.49386 3.83942 9.41677 3.91667L3.9251 9.40834C3.84785 9.48543 3.78656 9.577 3.74474 9.67782C3.70292 9.77863 3.6814 9.8867 3.6814 9.99584C3.6814 10.105 3.70292 10.213 3.74474 10.3139C3.78656 10.4147 3.84785 10.5062 3.9251 10.5833L9.41677 16.075C9.49392 16.1522 9.58551 16.2134 9.68631 16.2551C9.78712 16.2969 9.89516 16.3184 10.0043 16.3184C10.1134 16.3184 10.2214 16.2969 10.3222 16.2551C10.423 16.2134 10.5146 16.1522 10.5918 16.075C10.6689 15.9979 10.7301 15.9063 10.7719 15.8055C10.8136 15.7047 10.8351 15.5966 10.8351 15.4875C10.8351 15.3784 10.8136 15.2704 10.7719 15.1695C10.7301 15.0687 10.6689 14.9772 10.5918 14.9L6.5251 10.8333H15.8334C16.2918 10.8333 16.6668 10.4583 16.6668 10C16.6668 9.54167 16.2918 9.16667 15.8334 9.16667Z"
                fill="black"
              />
            </svg>
          </span>
          <span className="text-sm text-black font-[500]">Checkout</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm
              fullName={fullName}
              setFullName={setFullName}
              email={email}
              setEmail={setEmail}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              agreedToTerms={agreedToTerms}
              setAgreedToTerms={setAgreedToTerms}
              discount={discount}
              onApplyPromo={handleApplyPromo}
              onSubmit={handleSubmit}
            />
          </div>

          <div className="lg:col-span-1">
            <CheckoutSummary
              experienceName={bookingData.experience.name}
              date={bookingData.slot.slot_date}
              time={bookingData.slot.slot_time}
              quantity={quantity}
              subtotal={bookingData.subtotal}
              taxes={bookingData.taxes}
              discount={discount}
              total={finalTotal}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isDisabled={!agreedToTerms || !email || !fullName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}