import { useState } from "react";
import { Search, X } from "lucide-react";

// ============================================================
// SearchBar Component
// Debounce-free search input for filtering products by name
// or barcode. Emits search term via `onSearch` callback.
// ============================================================

export default function SearchBar({ onSearch, placeholder = "Search by name or barcode…" }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch?.("");
  };

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-white text-sm
                   placeholder:text-text-muted
                   focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                   transition-all duration-200"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md
                     hover:bg-surface-hover transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4 text-text-muted" />
        </button>
      )}
    </div>
  );
}
