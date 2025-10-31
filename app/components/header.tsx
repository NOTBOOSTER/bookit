"use client";

import Image from "next/image";
import { useState, FormEvent } from "react";
import { useSearch } from "@/app/lib/SearchContext";
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
  const [inputValue, setInputValue] = useState("");
  const { setSearchQuery } = useSearch();
  const router = useRouter();
  const pathname = usePathname();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (pathname !== "/") {
      sessionStorage.setItem("pendingSearch", inputValue);
      router.push("/");
    } else {
      setSearchQuery(inputValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value === "") {
      setSearchQuery("");
    }
  };

  const handleLogoClick = () => {
    setInputValue("");
    setSearchQuery("");
    if (pathname !== "/") {
      router.push("/");
    }
  };

  return (
    <div className="w-full h-auto bg-[#F9F9F9] drop-shadow-md shadow-[#0000001A] flex justify-between items-center p-4 px-4 sm:px-8 md:px-12 lg:px-24 flex-col sm:flex-row gap-4 sm:gap-0">
      <Image
        className="cursor-pointer"
        src="/logo.png"
        alt="header"
        width={100}
        height={100}
        onClick={handleLogoClick}
      />
      <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-4 w-full sm:w-auto">
        <input
          type="text"
          id="search"
          value={inputValue}
          onChange={handleInputChange}
          className="bg-[#EDEDED] h-8 w-full sm:w-56 rounded-sm p-4 text-sm focus:outline-gray-300 text-[#161616] placeholder:text-[#727272]"
          placeholder="Search experiences"
        />
        <button
          type="submit"
          className="bg-[#FFD643] h-8 w-20 rounded-lg text-sm text-[#161616] hover:bg-[#FFCA28] transition-colors flex-shrink-0"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default Header;