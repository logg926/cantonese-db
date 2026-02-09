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
