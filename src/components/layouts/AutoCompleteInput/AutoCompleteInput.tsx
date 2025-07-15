"use client";

import { useEffect, useRef, useState } from "react";

type Customer = {
  formattedTitle: string;
  targetAcc: string;
};

interface AutoCompleteInputProps {
  value: string;
  onSearch: (value: string) => void;
  onSelect: (value: string) => void;
  items: Customer[];
  loading?: boolean;
  itemTitle?: string;
  itemValue?: string;
  placeholder?: string;
}

export default function AutoCompleteInput({
  value,
  onSearch,
  onSelect,
  items,
  loading = false,
  placeholder = "Search account...",
}: AutoCompleteInputProps) {
  const [showList, setShowList] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setShowList(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onSearch(e.target.value);
          setShowList(true);
        }}
        placeholder={placeholder}
        className="w-full border px-3 py-2 rounded-md shadow text-sm focus:outline-none bg-background text-text"
      />
      {loading && (
        <div className="absolute right-2 top-2 text-gray-500 text-xs">
          Loading...
        </div>
      )}
      {showList && items.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-background text-sm shadow-md">
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                onSelect(item.targetAcc);
                setShowList(false);
              }}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
              {item.formattedTitle}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
