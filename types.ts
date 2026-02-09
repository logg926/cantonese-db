export interface WorkItem {
    id: string; // CSV often returns string IDs
    year: number;
    composerC: string;
    composerE: string;
    titleC: string;
    titleE: string;
    voice: string;
    instrument: string;
    author: string;
    duration: string;
    publisher: string;
    link: string;
    remarks: string;
    // New fields
    perusalScore: string;    // URL to view score
    textFirst: boolean;      // Whether lyrics came before music
    textType: string;        // e.g. "古詩, 唐詩"
    otherLanguages: string;  // Other available languages
}

export interface FilterState {
    search: string;
    voice: string[];
    acc: string[];
    inst: string[];
    composer: string[];
}

export type SortOption = 'year-desc' | 'year-asc' | 'title-asc';

export type ViewMode = 'works' | 'composers';
