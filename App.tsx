import React, { useState, useEffect, useMemo } from 'react';
import { fetchWorksData } from './services/dataService';
import { WorkItem, FilterState, ViewMode, SortOption } from './types';
import Sidebar from './components/Sidebar';
import CoverArt from './components/CoverArt';
import ProductModal from './components/ProductModal';

const App: React.FC = () => {
  const [data, setData] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('works');
  
  // Modals
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    voice: [],
    acc: [],
    inst: [],
    composer: []
  });
  const [sort, setSort] = useState<SortOption>('year-desc');

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
    data.forEach(item => {
        if (item.composerC && !map.has(item.composerC)) {
            map.set(item.composerC, item.composerE || '');
        }
    });
    return Array.from(map.entries()).map(([c, e]) => ({ c, e })).sort((a, b) => a.c.localeCompare(b.c));
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search
      const s = filters.search.toLowerCase();
      const matchSearch = !s || 
          item.titleC?.includes(s) || 
          item.titleE?.toLowerCase().includes(s) || 
          item.composerC?.includes(s) || 
          (item.composerE && item.composerE.toLowerCase().includes(s));

      // Composer
      const matchComp = filters.composer.length === 0 || filters.composer.includes(item.composerC);

      // Voice
      let matchVoice = true;
      if (filters.voice.length > 0) {
        const v = (item.voice || '').toLowerCase();
        matchVoice = filters.voice.some(r => {
          if (r === 'SATB') return v.includes('satb') || v.includes('mixed');
          if (r === 'SSAA') return v.includes('ssaa') || v.includes('sa ') || v === 'sa';
          if (r === 'TTBB') return v.includes('ttbb') || v.includes('tb ') || v === 'tb';
          if (r === 'Treble') return v.includes('treble') || v.includes('children');
          return false;
        });
      }

      // Accompaniment
      let matchAcc = true;
      const i = (item.instrument || '').toLowerCase();
      const isAcappella = i.includes('a cappella') || i === '' || i === 'none';

      if (filters.acc.length > 0) {
        matchAcc = false;
        if (filters.acc.includes('A cappella') && isAcappella) matchAcc = true;
        if (filters.acc.includes('Accompanied') && !isAcappella) matchAcc = true;
      }

      let matchInst = true;
      if (filters.inst.length > 0) {
         matchInst = filters.inst.some(req => {
             if (req === 'Piano') return i.includes('piano');
             if (req === 'Orchestra') return i.includes('orchestra');
             if (req === 'Chinese') return i.includes('chinese') || i.includes('erhu') || i.includes('zheng');
             return false;
         });
      }

      return matchSearch && matchComp && matchVoice && matchAcc && matchInst;
    }).sort((a, b) => {
      if (sort === 'year-desc') return (b.year || 0) - (a.year || 0);
      if (sort === 'year-asc') return (a.year || 0) - (b.year || 0);
      return (a.titleC || '').localeCompare(b.titleC || '');
    });
  }, [data, filters, sort]);

  const removeFilter = (key: keyof FilterState, val: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: (prev[key] as string[]).filter(v => v !== val)
    }));
  };

  // Composer Grid Data
  const composerList = useMemo(() => {
    const map: Record<string, { c: string; e: string; count: number }> = {};
    data.forEach(i => {
       if (i.composerC) {
           if (!map[i.composerC]) map[i.composerC] = { c: i.composerC, e: i.composerE, count: 0 };
           map[i.composerC].count++;
       }
    });
    return Object.values(map).sort((a, b) => a.e.localeCompare(b.e));
  }, [data]);

  const [compGridSearch, setCompGridSearch] = useState('');

  return (
    <div className="font-sans antialiased min-h-screen flex flex-col bg-white text-ink-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center gap-4 cursor-pointer flex-shrink-0" onClick={() => window.location.reload()}>
            <div className="w-10 h-10 bg-royal-900 text-white flex items-center justify-center font-serif text-xl font-bold rounded shadow-md border border-royal-700">D</div>
            <div className="flex flex-col">
              <h1 className="font-serif text-xl font-bold text-royal-900 leading-none tracking-tight">粵語現代音樂研究</h1>
              <span className="text-[10px] font-mono tracking-[0.2em] text-gold-500 uppercase mt-1">Decoding Cantonese Creativity</span>
            </div>
          </div>

          <div className="hidden md:flex gap-12">
            <button onClick={() => setView('works')} className={`nav-tab text-sm tracking-widest uppercase ${view === 'works' ? 'active text-royal-800 font-bold border-b-2 border-royal-800' : 'text-gray-500'}`}>作品目錄 Works</button>
            <button onClick={() => setView('composers')} className={`nav-tab text-sm tracking-widest uppercase ${view === 'composers' ? 'active text-royal-800 font-bold border-b-2 border-royal-800' : 'text-gray-500'}`}>作曲家 Composers</button>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right hidden xl:block mr-4">
              <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Total Archive</div>
              <div className="text-xl font-mono font-bold text-royal-900 leading-none">{data.length}</div>
            </div>
            <a 
              href="https://forms.gle/bineVPkwUr8DxXQq6"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-royal-900 text-white px-5 py-2.5 rounded text-sm font-medium hover:bg-royal-800 transition-all shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <i className="fa-solid fa-cloud-arrow-up"></i> <span className="hidden sm:inline">提交資料</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 max-w-[1920px] mx-auto w-full relative">
        <Sidebar 
          visible={view === 'works'}
          filters={filters} 
          setFilters={setFilters} 
          composers={composers}
        />

        <main className="flex-1 p-6 lg:p-10 bg-white relative min-h-screen">
          
          {loading ? (
             <div className="flex items-center justify-center h-64">
                <i className="fa-solid fa-circle-notch fa-spin text-3xl text-royal-200"></i>
             </div>
          ) : view === 'works' ? (
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-100 pb-6">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-royal-900 mb-1">典藏作品目錄</h2>
                  <div className="flex gap-2 text-sm text-gray-500 font-sans items-center">
                    <span>顯示</span>
                    <span className="font-bold text-royal-800 bg-royal-50 px-2 rounded">{filteredData.length}</span>
                    <span>筆結果</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select 
                        value={sort} 
                        onChange={(e) => setSort(e.target.value as SortOption)}
                        className="appearance-none bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded text-sm font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-royal-800 transition-colors"
                    >
                      <option value="year-desc">年份 (新 → 舊)</option>
                      <option value="year-asc">年份 (舊 → 新)</option>
                      <option value="title-asc">標題 (A - Z)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <i className="fa-solid fa-arrow-down-short-wide text-xs"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Tags */}
              <div className="flex flex-wrap gap-2 mb-6 min-h-[0px]">
                  {[...filters.voice, ...filters.acc, ...filters.inst, ...filters.composer].map((tag, idx) => (
                      <button key={idx} onClick={() => {
                          if (filters.voice.includes(tag)) removeFilter('voice', tag);
                          else if (filters.acc.includes(tag)) removeFilter('acc', tag);
                          else if (filters.inst.includes(tag)) removeFilter('inst', tag);
                          else removeFilter('composer', tag);
                      }} className="px-3 py-1 bg-royal-50 border border-royal-100 text-royal-800 text-xs font-bold rounded-full flex items-center gap-2 hover:bg-royal-100">
                          {tag} <i className="fa-solid fa-xmark"></i>
                      </button>
                  ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-12">
                {filteredData.map((item, idx) => (
                    <div key={item.id} className="group cursor-pointer flex flex-col gap-3 animate-fade-in" style={{ animationDelay: `${idx < 15 ? idx * 50 : 0}ms` }} onClick={() => setSelectedItem(item)}>
                        <div className="w-full aspect-[3/4] relative shadow-sm group-hover:shadow-xl transition-all duration-500 overflow-hidden bg-gray-50">
                            <CoverArt item={item} />
                            <div className="absolute inset-0 bg-royal-900/0 group-hover:bg-royal-900/10 transition-colors z-20"></div>
                        </div>
                        <div className="px-1">
                            <h3 className="font-serif font-bold text-gray-900 text-sm truncate group-hover:text-royal-800 transition-colors">{item.titleC}</h3>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-[10px] text-gray-500 font-sans uppercase tracking-wide truncate max-w-[60%]">{item.composerC}</span>
                                <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1 rounded whitespace-nowrap">{item.voice}</span>
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
                    <p className="text-gray-500 text-sm">沒有找到符合條件的作品</p>
                    <button onClick={() => setFilters({ search: '', voice: [], acc: [], inst: [], composer: [] })} className="mt-4 text-royal-800 text-sm font-bold hover:underline">清除篩選</button>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fade-in">
               <div className="mb-10 text-center max-w-2xl mx-auto">
                    <h2 className="font-serif text-4xl font-bold text-royal-900 mb-4">作曲家名錄</h2>
                    <p className="text-gray-500">匯集香港當代最具影響力的合唱音樂創作者。</p>
                </div>
                
                <div className="mb-8 max-w-md mx-auto relative">
                     <input 
                        type="text" 
                        value={compGridSearch}
                        onChange={(e) => setCompGridSearch(e.target.value)}
                        placeholder="搜尋作曲家姓名..." 
                        className="w-full bg-gray-50 border-b-2 border-gray-200 text-center text-lg py-3 focus:outline-none focus:border-royal-800 focus:bg-white transition-all placeholder-gray-400 font-serif"
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {composerList.filter(c => c.c.includes(compGridSearch) || c.e.toLowerCase().includes(compGridSearch.toLowerCase())).map(c => (
                        <div key={c.c} onClick={() => {
                            setFilters(prev => ({ ...prev, composer: [c.c] }));
                            setView('works');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} className="bg-gray-50 hover:bg-white hover:shadow-xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group rounded-sm aspect-square">
                            <div className="w-16 h-16 rounded-full bg-royal-100 text-royal-900 flex items-center justify-center text-xl font-serif font-bold mb-4 group-hover:bg-royal-900 group-hover:text-white transition-colors">
                                {c.e ? c.e[0] : c.c[0]}
                            </div>
                            <h3 className="font-serif font-bold text-lg text-gray-900 mb-1">{c.c}</h3>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 truncate w-full">{c.e}</p>
                            <span className="text-[10px] font-mono bg-white border border-gray-200 px-2 py-1 rounded-full text-gray-400 group-hover:border-royal-200 group-hover:text-royal-800 transition-colors">
                                {c.count} Works
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