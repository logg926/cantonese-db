import React from 'react';
import { WorkItem } from '../types';
import CoverArt from './CoverArt';

interface ProductModalProps {
    item: WorkItem | null;
    onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ item, onClose }) => {
    if (!item) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-royal-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            
            <div className="relative z-10 bg-white w-full max-w-5xl rounded shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-fade-in">
                <button onClick={onClose} className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/10 hover:bg-black/20 text-gray-800 rounded-full flex items-center justify-center transition-colors">
                    <i className="fa-solid fa-times"></i>
                </button>

                {/* Left: Cover Art */}
                <div className="w-full md:w-5/12 bg-gray-100 relative flex-shrink-0 min-h-[300px] md:min-h-0 overflow-hidden">
                    <div className="absolute inset-0 w-full h-full">
                        <CoverArt item={item} />
                    </div>
                </div>

                {/* Right: Content */}
                <div className="w-full md:w-7/12 flex flex-col h-full bg-white">
                    <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                        
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-2 py-1 bg-royal-900 text-white text-[10px] font-bold font-mono uppercase tracking-wider">{item.voice || 'N/A'}</span>
                            <span className="px-2 py-1 bg-gold-400 text-white text-[10px] font-bold font-mono">{item.year || 'N/A'}</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2 leading-tight">{item.titleC}</h2>
                        <h3 className="text-xl font-light text-gray-400 italic font-serif mb-10">{item.titleE}</h3>

                        <div className="grid grid-cols-2 gap-y-8 gap-x-8 mb-10">
                            <div className="border-l-2 border-gold-400 pl-4">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-mono">Composer</h4>
                                <p className="text-lg font-bold text-royal-900">{item.composerC} {item.composerE}</p>
                            </div>
                            <div className="border-l-2 border-gray-200 pl-4">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-mono">Lyricist</h4>
                                <p className="text-lg font-medium text-gray-800">{item.author || "未註明"}</p>
                            </div>
                            <div className="border-l-2 border-gray-200 pl-4">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-mono">Instrumentation</h4>
                                <p className="text-sm text-gray-600 font-mono">{item.instrument || "N/A"}</p>
                            </div>
                            <div className="border-l-2 border-gray-200 pl-4">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-mono">Duration</h4>
                                <p className="text-sm text-gray-600 font-mono">{item.duration || "N/A"}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded mb-8">
                            <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-widest">Remarks</h4>
                            <p className="text-sm text-gray-600 leading-relaxed font-serif">{item.remarks || "No additional remarks."}</p>
                        </div>

                    </div>

                    <div className="p-6 border-t border-gray-100 flex items-center gap-4 bg-gray-50">
                        {item.link ? (
                            <a href={item.link} target="_blank" rel="noreferrer" className="flex-1 bg-royal-900 text-white py-4 text-center font-bold hover:bg-royal-800 transition-all flex items-center justify-center gap-3 shadow-lg hover:-translate-y-1 rounded">
                                <i className="fa-solid fa-play"></i>
                                <span>觀看演出 / 聆聽錄音</span>
                            </a>
                        ) : (
                            <button disabled className="flex-1 bg-gray-300 text-white py-4 text-center font-bold cursor-not-allowed flex items-center justify-center gap-3 rounded">
                                <i className="fa-solid fa-play-slash"></i>
                                <span>暫無錄音 / Recording Unavailable</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;