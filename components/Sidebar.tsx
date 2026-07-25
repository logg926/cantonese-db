import React, { useState } from "react";
import { FilterState } from "../types";
import { matchesSearch } from "../utils/search";

interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  composers: { c: string; e: string }[];
  visible: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  filters,
  setFilters,
  composers,
  visible,
  mobileOpen,
  onMobileClose,
}) => {
  const [composerSearch, setComposerSearch] = useState("");

  const toggleFilter = (category: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const current = prev[category] as string[];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({ search: "", voice: [], accompaniment: [], composer: [] });
    setComposerSearch("");
  };

  const filteredComposers = composers.filter((item) =>
    matchesSearch(composerSearch, [item.c, item.e]),
  );

  if (!visible) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar - Desktop: static, Mobile: slide-in panel */}
      <aside
        className={`
            w-80 flex-shrink-0 border-r border-gray-100 bg-[#FAFAFA] p-6 overflow-y-auto custom-scrollbar transition-all duration-300
            lg:block lg:h-[calc(100vh-80px)] lg:sticky lg:top-20
            fixed top-0 right-0 h-full z-50
            ${mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
            ${!mobileOpen && "hidden lg:block"}
        `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onMobileClose}
          aria-label="關閉篩選 Close filters"
          className="lg:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-lg font-bold text-royal-900 flex items-center gap-2">
            <i className="fa-solid fa-sliders text-sm text-gold-500"></i> 篩選
            Filters
          </h3>
          <button
            onClick={clearFilters}
            className="text-xs text-gray-400 hover:text-royal-800 font-medium uppercase tracking-wider transition-colors"
          >
            重置 Reset
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="關鍵字搜尋 Keyword Search…"
            value={filters.search}
            onChange={handleSearch}
            className="w-full bg-white border border-gray-200 rounded text-sm py-2 px-3 focus:outline-none focus:border-royal-800 focus:ring-1 focus:ring-royal-800 transition-all placeholder-gray-400"
          />
        </div>

        {/* Voice Type */}
        <div className="filter-section mb-6 border-b border-gray-100 pb-5">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono mb-3">
            聲部 Voice Type
          </h4>
          <div className="space-y-2">
            {["Mixed", "High", "Low", "Unison"].map((v) => (
              <label
                key={v}
                className="flex items-center gap-3 cursor-pointer hover:bg-white p-1 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  className="dcc-checkbox"
                  checked={filters.voice.includes(v)}
                  onChange={() => toggleFilter("voice", v)}
                />
                <span className="text-sm text-gray-700">
                  {v === "Mixed"
                    ? "混聲合唱 Mixed Choir — SAB, SATB, etc."
                    : v === "High"
                      ? "高音聲部 High Voices — SA, SSA, etc."
                      : v === "Low"
                        ? "低音聲部 Low Voices — TB, TTB, etc."
                        : "單聲部 Unison"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Accompaniment */}
        <div className="filter-section mb-6 border-b border-gray-100 pb-5">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono mb-3">
            伴奏 Accompaniment
          </h4>
          <div className="space-y-2">
            {["A cappella", "Piano", "Organ", "Western", "Chinese"].map((v) => (
              <label
                key={v}
                className="flex items-center gap-3 cursor-pointer hover:bg-white p-1 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  className="dcc-checkbox"
                  checked={filters.accompaniment.includes(v)}
                  onChange={() => toggleFilter("accompaniment", v)}
                />
                <span className="text-sm text-gray-700">
                  {v === "A cappella"
                    ? "無伴奏 A cappella"
                    : v === "Piano"
                      ? "鋼琴 Piano"
                      : v === "Organ"
                        ? "管風琴 Organ"
                        : v === "Western"
                          ? "西樂 Western Inst."
                          : "中樂 Chinese Inst."}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Composers */}
        <div className="filter-section">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">
              作曲家 Composer
            </h4>
          </div>
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="作曲家搜尋 Composer Search..."
              value={composerSearch}
              onChange={(e) => setComposerSearch(e.target.value)}
              className="w-full text-xs p-2 border border-gray-200 rounded bg-white focus:border-royal-800 outline-none"
            />
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {filteredComposers.map((item) => (
              <label
                key={item.c}
                className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  className="dcc-checkbox"
                  checked={filters.composer.includes(item.c)}
                  onChange={() => toggleFilter("composer", item.c)}
                />
                <span className="text-xs text-gray-700 truncate w-full">
                  {item.c}
                  {item.e && (
                    <span className="text-gray-400 ml-1 text-[10px]">
                      {item.e}
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
