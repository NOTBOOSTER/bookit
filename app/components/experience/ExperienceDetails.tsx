// app/components/experience/ExperienceDetails.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import PricingSummary from "./PricingSummary";
import { Slot, PropsExperienceDetails } from "@/app/lib/types";

export default function ExperienceDetails({
  experience,
  slots,
}: PropsExperienceDetails) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [quantity, setQuantity] = useState(1);

  const uniqueDates = Array.from(new Set(slots.map((slot) => slot.slot_date)));

  const availableTimesForDate = selectedDate
    ? slots.filter((slot) => slot.slot_date === selectedDate)
    : [];

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && selectedSlot) {
      if (newQuantity <= selectedSlot.available_slots) {
        setQuantity(newQuantity);
      }
    } else if (!selectedSlot && newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleConfirm = () => {
    if (!selectedSlot) {
      alert("Please select a date and time slot");
      return;
    }

    router.push(
      `/checkout?experienceId=${experience.id}&slotId=${selectedSlot.id}&quantity=${quantity}`
    );
  };

  const subtotal = experience.price * quantity;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + taxes;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6"
        >
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
          <span className="text-sm text-black font-[500]">Details</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative w-full h-96 rounded-lg overflow-hidden mb-6">
              <Image
                src={experience.image_url}
                alt={experience.name}
                fill
                className="object-cover"
              />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {experience.name}
            </h1>

            <p className="text-gray-600 text-md mb-6 leading-relaxed">
              {experience.description}
            </p>

            <div className="mb-8">
              <h2 className="text-lg font-[500] mb-4">Choose date</h2>
              <DatePicker
                dates={uniqueDates}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </div>

            {selectedDate && (
              <div className="mb-8">
                <h2 className="text-lg font-[500] mb-4">Choose time</h2>
                <TimePicker
                  slots={availableTimesForDate}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                />
                <p className="text-xs text-[#838383] mt-2">
                  All times are in IST (GMT +5:30)
                </p>
              </div>
            )}

            <div className="">
              <h2 className="text-lg font-[500] mb-2">About</h2>
              <p className="text-[#838383] text-xs bg-[#EEEEEE] rounded-sm p-2">
                Scenic routes, trained guides, and safety briefing. Minimum age{" "}
                {experience.min_age}.
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <PricingSummary
              startPrice={experience.price}
              quantity={quantity}
              subtotal={subtotal}
              taxes={taxes}
              total={total}
              onQuantityChange={handleQuantityChange}
              onConfirm={handleConfirm}
              isConfirmDisabled={!selectedSlot}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
