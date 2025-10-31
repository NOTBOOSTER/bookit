"use client";

import { PropsTimePicker } from "@/app/lib/types";

export default function TimePicker({ slots, selectedSlot, onSelectSlot }: PropsTimePicker) {
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'pm' : 'am';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="flex gap-3 flex-wrap">
      {slots.map((slot) => {
        const isSelected = selectedSlot?.id === slot.id;
        const isSoldOut = !slot.is_available;
        const slotsLeft = slot.available_slots;

        return (
          <button
            key={slot.id}
            onClick={() => onSelectSlot(isSoldOut ? null : slot)}
            disabled={isSoldOut}
            className={`px-3 py-1 rounded-sm border transition-colors relative ${
              isSoldOut
                ? 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed'
                : isSelected
                ? 'bg-[#FFD643] border-[#FFD643] text-[#161616]'
                : 'bg-white border-[#BDBDBD] text-[#838383] hover:border-gray-400'
            }`}
          >
            <span>{formatTime(slot.slot_time)}</span>
            {!isSoldOut && slotsLeft <= 5 && (
              <span className="ml-2 text-xs text-[#FF4C0A] font-medium">
                {slotsLeft} left
              </span>
            )}
            {isSoldOut && (
              <span className="ml-2 text-xs text-[#6A6A6A]">Sold out</span>
            )}
          </button>
        );
      })}
    </div>
  );
}