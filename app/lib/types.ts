export interface Experience {
  id: number;
  name: string;
  location: string;
  description: string;
  price: number;
  image_url: string;
}

export interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export interface Slot {
  id: number;
  slot_date: string;
  slot_time: string;
  total_capacity: number;
  booked_count: number;
  is_available: boolean;
  available_slots: number;
}

export interface ExperienceExperienceDetails {
  id: number;
  name: string;
  location: string;
  description: string;
  price: number;
  image_url: string;
  min_age: number;
}


export interface PropsExperienceDetails {
  experience: ExperienceExperienceDetails;
  slots: Slot[];
}

export interface PropsDatePicker {
  dates: string[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export interface Slots {
  id: number;
  slot_date: string;
  slot_time: string;
  total_capacity: number;
  booked_count: number;
  is_available: boolean;
  available_slots: number;
}

export interface PropsTimePicker {
  slots: Slots[];
  selectedSlot: Slots | null;
  onSelectSlot: (slot: Slots | null) => void;
}

export interface PropsPs {
  startPrice: number;
  quantity: number;
  subtotal: number;
  taxes: number;
  total: number;
  onQuantityChange: (delta: number) => void;
  onConfirm: () => void;
  isConfirmDisabled: boolean;
}

export interface BookingData {
  experience: {
    id: number;
    name: string;
    price: number;
  };
  slot: {
    id: number;
    slot_date: string;
    slot_time: string;
  };
  quantity: number;
  subtotal: number;
  taxes: number;
  total: number;
}