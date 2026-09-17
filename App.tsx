import React, { useState, useEffect, useMemo } from "react";
import { fetchWorksData } from "./services/dataService";
import { WorkItem, FilterState, ViewMode, SortOption } from "./types";
import Sidebar from "./components/Sidebar";
import CoverArt from "./components/CoverArt";
import ProductModal from "./components/ProductModal";
import { compareWorks, formatDuration, matchesDuration, matchesExplore } from "./utils/catalogue";
import { matchesSearch } from "./utils/search";
import {
  matchesAccompanimentFilters,
  matchesVoiceFilters,
} from "./utils/filters";

const FILTER_LABELS: Record<string, string> = {
  audio: "錄音試聽 With Audio",
  score: "樂譜試閱 With Score",
  Mixed: "混聲合唱 SAB, SATB, etc.",
  High: "高音聲部 SA, SSA, etc.",
  Low: "低音聲部 TB, TTB, etc.",
  Unison: "單聲部 Unison",
  "A cappella": "無伴奏 A cappella",
  Piano: "鋼琴 Piano",
  Organ: "管風琴 Organ",
  Western: "西樂 Western Instruments",
  Chinese: "中樂 Chinese Instruments",
};

const App: React.FC = () => {
  const [data, setData] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("works");

  // Modals
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    voice: [],
    accompaniment: [],
    composer: [],
    explore: [],
    duration: [0, 6],
  });
  const [sort, setSort] = useState<SortOption>("year-desc");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const works = await fetchWorksData();
      setData(works);
      setLoading(false);
    };
    load();
  }, []);

  const composers = useMemo(() => {
    const map = new Map<string, string>();
    data.forEach((item) => {
      if (item.composerC && !map.has(item.composerC)) {
        map.set(item.composerC, item.composerE || "");
      }
    });
    return Array.from(map.entries())
      .map(([c, e]) => ({ c, e }))
      .sort((a, b) => a.c.localeCompare(b.c));
  }, [data]);

  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        // Search
        const matchSearch = matchesSearch(filters.search, [
          item.titleC,
          item.titleE,
          item.composerC,
          item.composerE,
          item.author,
          item.textType,
          item.voice,
          item.instrument,
          item.publisher,
          item.remarks,
          item.otherLanguages,
          item.year,
        ]);

        // Composer
        const matchComp =
          filters.composer.length === 0 ||
          filters.composer.includes(item.composerC);

        // Voice
        const matchVoice = matchesVoiceFilters(
          item.voice || "",
          filters.voice,
        );

        // Accompaniment
        const matchAccompaniment = matchesAccompanimentFilters(
          item.instrument || "",
          filters.accompaniment,
        );

        return matchSearch && matchComp && matchVoice && matchAccompaniment &&
          matchesDuration(item.duration, filters.duration) && matchesExplore(item, filters.explore);
      })
      .sort((a, b) => compareWorks(a, b, sort));
  }, [data, filters, sort]);

  const removeFilter = (key: "voice" | "accompaniment" | "composer" | "explore", val: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: (prev[key] as string[]).filter((v) => v !== val),
    }));
  };

  // Composer Grid Data
  const composerList = useMemo(() => {
    const map: Record<string, { c: string; e: string; count: number }> = {};
    data.forEach((i) => {
      if (i.composerC) {
        if (!map[i.composerC])
          map[i.composerC] = { c: i.composerC, e: i.composerE, count: 0 };
        map[i.composerC].count++;
      }
    });
    return Object.values(map).sort((a, b) => a.e.localeCompare(b.e));
  }, [data]);

  const [compGridSearch, setCompGridSearch] = useState("");

  return (
    <div className="font-sans antialiased min-h-screen flex flex-col bg-white text-ink-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-8">
          <div
            className="flex items-center gap-2.5 sm:gap-4 cursor-pointer min-w-0"
            onClick={() => window.location.reload()}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-royal-900 text-white flex items-center justify-center font-serif text-xl font-bold rounded shadow-md border border-royal-700 flex-shrink-0">
              <span className="relative -top-0.5">合</span>
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="font-serif text-base sm:text-xl font-bold text-royal-900 leading-none tracking-tight whitespace-nowrap">
                粵語合唱音樂資料庫
              </h1>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.12em] text-gold-500 mt-1">
                CANTONESE CHORAL DATABASE
              </span>
              <span className="text-[9px] sm:text-[11px] leading-snug font-sans text-gray-500 mt-1 max-w-[240px] sm:max-w-none">
                Powered by <a href="https://cantonesecomposition.com" onClick={e => e.stopPropagation()} className="font-semibold text-royal-900 hover:underline">Cantonese Contemporary Music Research</a>
              </span>
            </div>
          </div>

          <div className="hidden md:flex gap-12">
            <button
              onClick={() => setView("works")}
              className={`nav-tab text-sm tracking-widest uppercase ${view === "works" ? "active text-royal-800 font-bold border-b-2 border-royal-800" : "text-gray-500"}`}
            >
              作品目錄 Work Listing
            </button>
            <button
              onClick={() => setView("composers")}
              className={`nav-tab text-sm tracking-widest uppercase ${view === "composers" ? "active text-royal-800 font-bold border-b-2 border-royal-800" : "text-gray-500"}`}
            >
              作曲家 Composer
            </button>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right hidden xl:block mr-4">
              <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                典藏總數 Total Archive
              </div>
              <div className="text-xl font-sans font-bold text-royal-900 leading-none">
                {data.length}
              </div>
            </div>
            <a
              href="https://forms.gle/bineVPkwUr8DxXQq6"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="提交資料 Submit Data"
              className="bg-royal-900 text-white px-3 sm:px-5 py-2.5 rounded text-sm font-medium hover:bg-royal-800 transition-all shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5 flex-shrink-0"
            >
              <i className="fa-solid fa-cloud-arrow-up"></i>{" "}
              <span className="hidden sm:inline">提交資料 Submit Data</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 max-w-[1920px] mx-auto w-full relative">
        <Sidebar
          visible={view === "works"}
          filters={filters}
          setFilters={setFilters}
          composers={composers}
          mobileOpen={mobileFilterOpen}
          onMobileClose={() => setMobileFilterOpen(false)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 bg-white relative min-h-screen">
          <div className="md:hidden grid grid-cols-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setView("works")}
              className={`py-3 text-xs tracking-wide ${view === "works" ? "text-royal-800 font-bold border-b-2 border-royal-800" : "text-gray-500"}`}
            >
              作品目錄 Work Listing
            </button>
            <button
              onClick={() => setView("composers")}
              className={`py-3 text-xs tracking-wide ${view === "composers" ? "text-royal-800 font-bold border-b-2 border-royal-800" : "text-gray-500"}`}
            >
              作曲家 Composer
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <i className="fa-solid fa-circle-notch fa-spin text-3xl text-royal-200"></i>
            </div>
          ) : view === "works" ? (
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-100 pb-6">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-royal-900 mb-1">
                    作品目錄 Work Listing
                  </h2>
                  <div className="flex gap-2 text-sm text-gray-500 font-sans items-center">
                    <span>顯示</span>
                    <span className="font-bold text-royal-800 bg-royal-50 px-2 rounded">
                      {filteredData.length}
                    </span>
                    <span>
                      筆結果 / Showing {filteredData.length} results
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 max-w-full">
                  <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-royal-50 text-royal-800 rounded text-sm font-medium hover:bg-royal-100 transition-colors"
                  >
                    <i className="fa-solid fa-sliders"></i> 篩選 Filters
                  </button>
                  <span className="hidden sm:inline text-xs font-bold text-gray-500">
                    排序 Sort
                  </span>
                  <div className="relative max-w-full">
                    <label
                      htmlFor="work-sort"
                      className="sr-only"
                    >
                      排序 Sort
                    </label>
                    <select
                      id="work-sort"
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SortOption)}
                      className="appearance-none max-w-full bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded text-sm font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-royal-800 transition-colors"
                    >
                      <option value="year-desc">
                        年份（新至舊）Year (Newest to Oldest)
                      </option>
                      <option value="year-asc">
                        年份（舊至新）Year (Oldest to Newest)
                      </option>
                      <option value="id-desc">最新加入 Latest Entry</option>
                      <option value="id-asc">最先加入 Oldest Entry</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <i className="fa-solid fa-arrow-down-short-wide text-xs"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Tags */}
              <div className="flex flex-wrap gap-2 mb-6 min-h-[0px]">
                {[
                  ...filters.explore,
                  ...filters.voice,
                  ...filters.accompaniment,
                  ...filters.composer,
                ].map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (filters.explore.includes(tag))
                        removeFilter("explore", tag);
                      else if (filters.voice.includes(tag))
                        removeFilter("voice", tag);
                      else if (filters.accompaniment.includes(tag))
                        removeFilter("accompaniment", tag);
                      else removeFilter("composer", tag);
                    }}
                    className="px-3 py-1 bg-royal-50 border border-royal-100 text-royal-800 text-xs font-bold rounded-full flex items-center gap-2 hover:bg-royal-100"
                  >
                    {FILTER_LABELS[tag] ?? tag}{" "}
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-12">
                {filteredData.map((item, idx) => (
                  <div
                    key={item.id}
                    data-work-id={item.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${item.titleC} ${item.titleE}`}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedItem(item); } }}
                    className="group cursor-pointer flex flex-col gap-3 animate-fade-in"
                    style={{ animationDelay: `${idx < 15 ? idx * 50 : 0}ms` }}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="w-full aspect-[3/4] relative shadow-sm group-hover:shadow-xl transition-all duration-500 overflow-hidden bg-gray-50">
                      <CoverArt item={item} />
                      <div className="absolute inset-0 bg-royal-900/0 group-hover:bg-royal-900/10 transition-colors z-20"></div>
                    </div>
                    <div className="px-1">
                      <h3 className="font-serif font-bold text-gray-900 text-sm truncate group-hover:text-royal-800 transition-colors">
                        {item.titleC}
                      </h3>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {item.titleE || "英文標題不詳 English title N/A"}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-gray-500 font-sans tracking-wide truncate max-w-[70%]">
                          {item.composerC}
                          {item.composerE && ` ${item.composerE}`}
                        </span>
                        <span className="text-[10px] font-sans text-gray-400 bg-gray-100 px-1 rounded whitespace-nowrap">
                          {item.voice}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[9px] text-gray-400">
                        <span>
                          {item.year || "年份不詳 Year N/A"}
                        </span>
                        <span>
                          {formatDuration(item.duration)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <i className="fa-solid fa-music text-3xl text-gray-300"></i>
                  </div>
                  <p className="text-gray-500 text-sm">
                    沒有找到符合條件的作品 No matching works found
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        search: "",
                        voice: [],
                        accompaniment: [],
                        composer: [],
                        explore: [],
                        duration: [0, 6],
                      })
                    }
                    className="mt-4 text-royal-800 text-sm font-bold hover:underline"
                  >
                    清除篩選 Clear Filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="mb-8 text-center max-w-2xl mx-auto">
                <h2 className="font-serif text-4xl font-bold text-royal-900">
                  作曲家 Composer
                </h2>
              </div>

              <div className="mb-8 max-w-md mx-auto relative">
                <input
                  type="text"
                  value={compGridSearch}
                  onChange={(e) => setCompGridSearch(e.target.value)}
                  placeholder="姓名搜尋 Name Search..."
                  className="w-full bg-gray-50 border-b-2 border-gray-200 text-center text-lg py-3 focus:outline-none focus:border-royal-800 focus:bg-white transition-all placeholder-gray-400 font-serif"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {composerList
                  .filter(
                    (c) => matchesSearch(compGridSearch, [c.c, c.e]),
                  )
                  .map((c) => (
                    <div
                      key={c.c}
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, composer: [c.c] }));
                        setView("works");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="bg-gray-50 hover:bg-white hover:shadow-xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group rounded-sm aspect-square"
                    >
                      <div className="w-16 h-16 rounded-full bg-royal-100 text-royal-900 flex items-center justify-center text-xl font-serif font-bold mb-4 group-hover:bg-royal-900 group-hover:text-white transition-colors">
                        {c.e ? c.e[0] : c.c[0]}
                      </div>
                      <h3 className="font-serif font-bold text-lg text-gray-900 mb-1">
                        {c.c}
                      </h3>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 truncate w-full">
                        {c.e}
                      </p>
                      <span className="text-[10px] font-sans bg-white border border-gray-200 px-2 py-1 rounded-full text-gray-400 group-hover:border-royal-200 group-hover:text-royal-800 transition-colors">
                        作品數 Works: {c.count}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <ProductModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default App;
