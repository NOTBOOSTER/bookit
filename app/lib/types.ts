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