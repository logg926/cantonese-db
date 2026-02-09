import React, { useState } from 'react';

interface SubmitModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SubmitModal: React.FC<SubmitModalProps> = ({ isOpen, onClose }) => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                onClose();
            }, 1500);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-royal-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            
            <div className="relative z-10 pointer-events-auto bg-white w-full max-w-3xl rounded-lg shadow-2xl overflow-hidden transform flex flex-col max-h-[90vh] animate-fade-in">
                
                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <div>
                        <h2 className="font-serif text-xl font-bold text-royal-900">提交新研究資料</h2>
                        <p className="text-xs text-gray-500 mt-0.5 font-mono uppercase tracking-wide">Submit New Entry</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-royal-900 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200">
                        <i className="fa-solid fa-times text-lg"></i>
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <form id="submitForm" onSubmit={handleSubmit}>
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-royal-900 mb-4 flex items-center gap-2 border-l-4 border-gold-400 pl-2">
                                基本資訊 Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">作品中文標題 Title (Chi)</label>
                                    <input type="text" className="form-input w-full p-2 border rounded" required placeholder="例如：落花流水" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">作品英文標題 Title (Eng)</label>
                                    <input type="text" className="form-input w-full p-2 border rounded" placeholder="e.g. Falling Flowers" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">創作年份 Year</label>
                                    <input type="number" className="form-input w-full p-2 border rounded" required placeholder="YYYY" min="1900" max="2030" />
                                </div>
                            </div>
                        </div>
                        {/* More fields could be added here similar to HTML template */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-royal-900 mb-4 flex items-center gap-2 border-l-4 border-gold-400 pl-2">
                                創作人員 Creative Team
                            </h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">作曲家中文姓名 Composer (Chi)</label>
                                    <input type="text" className="form-input w-full p-2 border rounded" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">作曲家英文姓名 Composer (Eng)</label>
                                    <input type="text" className="form-input w-full p-2 border rounded" required />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 rounded text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors">
                        取消 Cancel
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={status === 'loading'}
                        className={`px-6 py-2.5 rounded text-sm font-bold text-white shadow-lg transition-all flex items-center gap-2 ${
                            status === 'success' ? 'bg-green-600 hover:bg-green-500' : 'bg-royal-900 hover:bg-royal-800'
                        }`}
                    >
                        {status === 'loading' && <i className="fa-solid fa-circle-notch fa-spin"></i>}
                        {status === 'success' && <i className="fa-solid fa-check"></i>}
                        <span>{status === 'loading' ? '處理中...' : status === 'success' ? '提交成功' : '提交資料 Submit'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmitModal;
