import React from 'react';
import { WorkItem } from '../types';

interface CoverArtProps {
    item: WorkItem;
}

const CoverArt: React.FC<CoverArtProps> = ({ item }) => {
    // Determine style based on ID hash or random logic consistent for the item
    // We use a simple hash of the title string to keep it consistent
    const hashStr = item.titleC + item.composerC;
    let hash = 0;
    for (let i = 0; i < hashStr.length; i++) {
        hash = hashStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);
    const styleIdx = seed % 4;

    const themes = [
        { bg: 'bg-royal-900', text: 'text-gold-400', sub: 'text-gray-400' },
        { bg: 'bg-[#FAFAFA]', text: 'text-royal-900', sub: 'text-gray-500' },
        { bg: 'bg-stone-100', text: 'text-black', sub: 'text-gray-500' },
        { bg: 'bg-gold-500', text: 'text-white', sub: 'text-royal-900' }
    ];
    
    const t = themes[seed % themes.length];

    const renderInner = () => {
        switch (styleIdx) {
            case 0: // Big Char
                return (
                    <>
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                            <span className={`text-[180px] font-serif font-black opacity-10 select-none ${t.text} scale-150 origin-bottom-right transform translate-y-10 translate-x-10`}>
                                {item.titleC[0]}
                            </span>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 z-10">
                            <h3 className={`text-2xl font-bold font-serif leading-none mb-1 ${t.text}`}>{item.titleC}</h3>
                            <p className={`text-[10px] font-sans uppercase tracking-widest opacity-80 ${t.text}`}>{item.composerE}</p>
                        </div>
                        <div className={`absolute top-4 right-4 border border-current px-1.5 py-0.5 text-[10px] font-mono ${t.text} opacity-60`}>
                            {item.year || 'N/A'}
                        </div>
                    </>
                );
            case 1: // Vertical
                return (
                    <>
                        <div className={`absolute top-0 right-8 h-full border-r border-current opacity-20 ${t.text}`}></div>
                        <div className="absolute inset-0 flex flex-row-reverse p-6 items-start">
                             <div className={`writing-vertical-rl text-3xl font-serif font-black tracking-widest ${t.text}`} style={{ writingMode: 'vertical-rl' }}>
                                 {item.titleC}
                             </div>
                             <div className={`writing-vertical-rl text-[10px] font-sans uppercase tracking-[0.3em] mt-2 mr-3 opacity-60 ${t.text}`} style={{ writingMode: 'vertical-rl' }}>
                                 {item.composerE}
                             </div>
                        </div>
                        <div className={`absolute bottom-4 left-4 text-[10px] font-mono ${t.sub}`}>{item.voice}</div>
                    </>
                );
            case 2: // Centered
                return (
                    <div className={`absolute inset-4 border border-current opacity-30 ${t.text} flex flex-col items-center justify-center text-center p-4`}>
                        <div className={`w-1 h-8 bg-current opacity-50 mb-4 ${t.text}`}></div>
                        <h3 className={`text-2xl font-serif font-bold ${t.text} mb-2`}>{item.titleC}</h3>
                        <p className={`text-[9px] uppercase tracking-widest ${t.text} opacity-70`}>{item.titleE}</p>
                        <div className={`absolute bottom-2 font-mono text-[9px] ${t.text} opacity-50`}>{item.composerC}</div>
                    </div>
                );
            case 3: // Geometric
            default:
                return (
                    <>
                        <div className={`absolute top-0 left-0 w-1/2 h-1/2 bg-current opacity-5 ${t.text}`}></div>
                        <div className={`absolute bottom-0 right-0 w-24 h-24 rounded-full border border-current opacity-20 ${t.text} translate-x-10 translate-y-10`}></div>
                        <div className="absolute top-6 left-6 max-w-[80%]">
                             <div className="h-1 w-10 bg-gold-500 mb-3"></div>
                             <h3 className={`text-3xl font-black font-serif leading-none ${t.text}`}>{item.titleC}</h3>
                        </div>
                        <div className={`absolute bottom-6 left-6 text-xs font-bold ${t.sub}`}>{item.composerE}</div>
                    </>
                );
        }
    };

    return (
        <div className={`art-box ${t.bg} w-full h-full relative overflow-hidden transition-transform duration-500 group-hover:scale-105`}>
            {renderInner()}
        </div>
    );
};

export default CoverArt;
