import { WorkItem } from '../types';
import Papa from 'papaparse';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQaS75KNGyBrNrDoOLTUdDyG7HbYwSsfjR9bkgwMdpdgAXYWltg27zy7-8zWL7JSfJhMuqkzrTJ8T_/pub?output=csv';

export const fetchWorksData = async (): Promise<WorkItem[]> => {
    try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const csvText = await response.text();
        
        // Parse CSV using PapaParse
        const parseResult = Papa.parse(csvText, {
            skipEmptyLines: true,
            header: false // Return as array of arrays
        });

        if (parseResult.errors.length > 0) {
            console.warn("CSV Parse warnings:", parseResult.errors);
        }

        const lines = parseResult.data as string[][];
        if (!lines || lines.length === 0) return [];

        const headers = lines[0].map(h => h.toLowerCase().trim());
        const rows = lines.slice(1);

        // Map columns based on provided order:
        // 0: ID, 1: Year, 2: Composer (C), 3: Composer (E), 4: Title (C), 5: Title (E)
        // 6: Voice Type, 7: Instrument, 8: Duration, 9: Publisher, 10: Media Link
        // 11: Perusal Score, 12: Text-first, 13: Text-type, 14: Text Author (C), 15: Text Author (E)
        // 16: Other Language(s), 17: Remarks 1, 18: Remarks 2

        const getIndex = (keywords: string[], defaultIdx: number) => {
            const idx = headers.findIndex(h => keywords.some(k => h.includes(k.toLowerCase())));
            return idx !== -1 ? idx : defaultIdx;
        };

        const idxId = getIndex(['id'], 0);
        const idxYear = getIndex(['year', '年份'], 1);
        const idxCompC = getIndex(['composer (c)', '中文姓名'], 2);
        const idxCompE = getIndex(['composer (e)', '英文姓名'], 3);
        const idxTitleC = getIndex(['title (c)', '中文標題'], 4);
        const idxTitleE = getIndex(['title (e)', '英文標題'], 5);
        const idxVoice = getIndex(['voice', '聲部'], 6);
        const idxInst = getIndex(['instrument', '伴奏'], 7);
        const idxDur = getIndex(['duration', '時長'], 8);
        const idxPub = getIndex(['publisher', '出版'], 9);
        const idxLink = getIndex(['media link', 'link', 'url', '連結'], 10);
        const idxPerusalScore = getIndex(['perusal score', 'score'], 11);
        const idxTextFirst = getIndex(['text-first', 'text first'], 12);
        const idxTextType = getIndex(['text-type', 'text type'], 13);
        
        // Authors
        const idxAuthorC = getIndex(['text author (c)', '作詞'], 14);
        const idxAuthorE = getIndex(['text author (e)'], 15);
        const idxOtherLang = getIndex(['other language', 'other lang'], 16);
        
        // Remarks
        const idxRem1 = getIndex(['remarks 1', 'remarks'], 17);
        const idxRem2 = getIndex(['remarks 2'], 18);

        const data: WorkItem[] = rows.map((cols, index) => {
            const val = (idx: number) => (cols[idx] ? cols[idx].trim() : '');

            // Combine authors
            const authC = val(idxAuthorC);
            const authE = val(idxAuthorE);
            const author = [authC, authE].filter(Boolean).join(' / ');

            // Combine remarks
            const rem1 = val(idxRem1);
            const rem2 = val(idxRem2);
            const remarks = [rem1, rem2].filter(Boolean).join('; ');

            return {
                id: val(idxId) || `row-${index}`,
                year: parseInt(val(idxYear)) || 0,
                composerC: val(idxCompC) || 'Unknown Composer',
                composerE: val(idxCompE) || '',
                titleC: val(idxTitleC) || 'Unknown Title',
                titleE: val(idxTitleE) || '',
                voice: val(idxVoice) || '',
                instrument: val(idxInst) || '',
                author: author,
                duration: val(idxDur) || '',
                publisher: val(idxPub) || '',
                link: val(idxLink) || '',
                remarks: remarks,
                perusalScore: val(idxPerusalScore) || '',
                textFirst: val(idxTextFirst).toLowerCase() === 'yes',
                textType: val(idxTextType) || '',
                otherLanguages: val(idxOtherLang) || '',
            };
        });

        return data;

    } catch (error) {
        console.error("Error loading works data:", error);
        return [];
    }
};