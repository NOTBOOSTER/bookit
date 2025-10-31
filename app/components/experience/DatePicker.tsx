"use client";

import { PropsDatePicker } from "@/app/lib/types";

export default function DatePicker({
  dates,
  selectedDate,
  onSelectDate,
}: PropsDatePicker) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleDateString("en-US", { month: "short" }),
      day: date.getDate(),
    };
  };

  return (
    <div className="flex gap-3 flex-wrap">
      {dates.map((date) => {
        const { month, day } = formatDate(date);
        const isSelected = selectedDate === date;

        return (
          <button
            key={date}
            onClick={() => onSelectDate(date)}
            className={`px-3 py-1 rounded-sm border transition-colors ${
              isSelected
                ? "bg-[#FFD643] border-[#FFD643] text-[#161616]"
                : "bg-white border-[#BDBDBD] text-[#838383] hover:border-gray-400"
            }`}
          >
            {month} {day}
          </button>
        );
      })}
    </div>
  );
}
