import React, { useState } from 'react';
import { FilterState } from '../types';

interface SidebarProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    composers: { c: string; e: string }[];
    visible: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters, composers, visible }) => {
    const [composerSearch, setComposerSearch] = useState('');

    const toggleFilter = (category: keyof FilterState, value: string) => {
        setFilters(prev => {
            const current = prev[category] as string[];
            if (current.includes(value)) {
                return { ...prev, [category]: current.filter(v => v !== value) };
            } else {
                return { ...prev, [category]: [...current, value] };
            }
        });
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, search: e.target.value.toLowerCase() }));
    };

    const clearFilters = () => {
        setFilters({ search: '', voice: [], acc: [], inst: [], composer: [] });
    };

    const filteredComposers = composers.filter(item => 
        item.c.toLowerCase().includes(composerSearch.toLowerCase()) || 
        item.e.toLowerCase().includes(composerSearch.toLowerCase())
    );

    if (!visible) return null;

    return (
        <aside className="w-80 flex-shrink-0 border-r border-gray-100 bg-[#FAFAFA] p-6 hidden lg:block overflow-y-auto h-[calc(100vh-80px)] sticky top-20 custom-scrollbar transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-lg font-bold text-royal-900 flex items-center gap-2">
                    <i className="fa-solid fa-sliders text-sm text-gold-500"></i> 篩選 Filters
                </h3>
                <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-royal-800 font-medium uppercase tracking-wider transition-colors">
                    重置 Reset
                </button>
            </div>

            <div className="mb-6">
                <input 
                    type="text" 
                    placeholder="搜尋作品名稱..." 
                    value={filters.search}
                    onChange={handleSearch}
                    className="w-full bg-white border border-gray-200 rounded text-sm py-2 px-3 focus:outline-none focus:border-royal-800 focus:ring-1 focus:ring-royal-800 transition-all placeholder-gray-400"
                />
            </div>

            {/* Voice Type */}
            <div className="filter-section mb-6 border-b border-gray-100 pb-5">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono mb-3">聲部 Voice Type</h4>
                <div className="space-y-2">
                    {['SATB', 'SSAA', 'TTBB', 'Treble'].map(v => (
                        <label key={v} className="flex items-center gap-3 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                            <input 
                                type="checkbox" 
                                className="dcc-checkbox"
                                checked={filters.voice.includes(v)}
                                onChange={() => toggleFilter('voice', v)}
                            />
                            <span className="text-sm text-gray-700">
                                {v === 'SATB' ? '混聲 (SATB)' : 
                                 v === 'SSAA' ? '女聲 (SSAA/SA)' : 
                                 v === 'TTBB' ? '男聲 (TTBB/TB)' : '童聲 (Treble)'}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Accompaniment */}
            <div className="filter-section mb-6 border-b border-gray-100 pb-5">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono mb-3">伴奏 Accompaniment</h4>
                <div className="space-y-2">
                    {['A cappella', 'Accompanied'].map(v => (
                        <label key={v} className="flex items-center gap-3 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                            <input 
                                type="checkbox" 
                                className="dcc-checkbox"
                                checked={filters.acc.includes(v)}
                                onChange={() => toggleFilter('acc', v)}
                            />
                            <span className="text-sm text-gray-700">
                                {v === 'A cappella' ? '無伴奏 (A cappella)' : '有伴奏 (Accompanied)'}
                            </span>
                        </label>
                    ))}
                    <div className="border-t border-gray-100 my-2 pt-2"></div>
                    {['Piano', 'Orchestra', 'Chinese'].map(v => (
                         <label key={v} className="flex items-center gap-3 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                            <input 
                                type="checkbox" 
                                className="dcc-checkbox"
                                checked={filters.inst.includes(v)}
                                onChange={() => toggleFilter('inst', v)}
                            />
                            <span className="text-sm text-gray-700">
                                {v === 'Piano' ? '鋼琴 (Piano)' : 
                                 v === 'Orchestra' ? '管弦樂 (Orchestra)' : '中樂 (Chinese Inst.)'}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Composers */}
            <div className="filter-section">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">作曲家 Composer</h4>
                </div>
                <div className="relative mb-3">
                    <input 
                        type="text" 
                        placeholder="搜尋作曲家..." 
                        value={composerSearch}
                        onChange={(e) => setComposerSearch(e.target.value)}
                        className="w-full text-xs p-2 border border-gray-200 rounded bg-white focus:border-royal-800 outline-none"
                    />
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {filteredComposers.map(item => (
                        <label key={item.c} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                            <input 
                                type="checkbox" 
                                className="dcc-checkbox" 
                                checked={filters.composer.includes(item.c)}
                                onChange={() => toggleFilter('composer', item.c)}
                            />
                            <span className="text-xs text-gray-700 truncate w-full">
                                {item.c}
                                {item.e && <span className="text-gray-400 ml-1 text-[10px]">{item.e}</span>}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;