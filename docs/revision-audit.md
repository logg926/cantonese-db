# Database revision audit — 2026-09-17

Source: [2026-27 Database and Generator Revisions](https://docs.google.com/document/d/1oFJ9PTpMEJ6uRizigfTtcXkWyXxv5wNVqHYaZ5bYJ5I/edit), 07.13, 07.26 and 08.04 tabs, including embedded screenshots. Read/exported with Chrome. Later instructions supersede earlier ones (e.g. card audio status and branding).

| Requirement | Implementation / evidence |
| --- | --- |
| 07.13: choral.cantonesecomposition.com | Existing production domain works; added matching canonical URL |
| Chinese-first bilingual interface, Work Listing, Composer tab and name search | Existing labels retained; new controls bilingual; removed earlier voice-category English text as explicitly requested on 07.26 |
| Keyword search includes tags; Kai Young finds Kai-Young | Existing normalization retained; unit and browser checked, 唐詩 yields 13 works in default duration range; Kai Young finds 陳啟揚 |
| Mixed/high/low/unison; organ and Western including piano/orchestra | Existing categories retained with corrected wording; low-voice matching no longer matches the substrings in women/female |
| Purple rounded-square 合 favicon and logo | Existing identity retained; glyph raised by 2px in favicon and header |
| 07.26: gold uppercase English title | CANTONESE CHORAL DATABASE in gold |
| Attribution | Removed 由…提供 and Choral Comp; grey Powered by, purple link on Cantonese Contemporary Music Research only, to cantonesecomposition.com |
| Non-title English uses Inter | Header attribution and non-title metadata/filter labels use the existing Inter-based sans stack |
| Consistent year badge on every cover | Shared top-right badge across all four cover variants |
| Card metadata | Year and duration replace audio/score availability; availability remains in modal |
| Duration formatting | Numeric duration gets min; blank/unspecified/non-numeric entries show unspecified in card and modal |
| Explore | With Audio / With Score checkboxes; both selected requires both valid HTTP(S) links |
| Duration slider | Two handles; default 0–6, 0.5 steps, minimum 1-minute span (therefore upper cannot fall below 1), 10 is open-ended and displayed 10+; unknown duration always survives duration filtering |
| Voice wording | 混聲合唱 SAB, SATB, etc.; 高音聲部 SA, SSA, etc.; 低音聲部 TB, TTB, etc.; 單聲部 Unison |
| Instrument wording | Western Instruments / Chinese Instruments |
| 08.04 sorting | Added 最新加入 Latest Entry and 最先加入 Oldest Entry using numeric-aware sheet ID order; removed title A–Z; retained both year sorts |

## Validation before push

- `bun test`: 6 tests, 32 assertions passed; covers duration boundaries/unknowns/10+, numeric ID sort, media conjunction/placeholders, voice regression, tag/name search and Western/organ categories.
- `npm run typecheck`: passed.
- `npm run build`: passed (39 modules).
- `git diff --check`: passed.
- Chrome with real published sheet: 286 total, default 0–6 gives 233; audio 61, score 34, both 2. Independent CSV calculation agrees.
- Chrome duration: maximum End gives 10+ and all 286; Home clamps to 0–1 and 37 records; ArrowRight advances to 0–1.5.
- Chrome sort: first IDs 286 for latest and 001 for oldest.
- Chrome modal: 清明 displays 3 min; 綠色組曲 remains visible at 0–1 and displays unspecified; both-resource result displays working destination links.
- Chrome mobile: actual CSS viewport 390px, no horizontal document overflow; Explore → result → detail flow works. Fixed retained sidebar scroll position and close-button/year-badge overlap discovered during this check.
- Desktop layout inspected visually. Browser viewport restored after mobile tests.

## Data assumptions

The source contains nonnumeric durations (including annotated unspecified values and one alternative-duration entry). These remain visible as unspecified rather than being interpreted with an arbitrary `parseFloat` value. The source sheet itself is not modified. Media placeholders such as issuu / OUT OF PRINT are not usable preview URLs and are excluded from Explore; modal buttons show unavailable for these entries.

The Melody Generator and converter changes belong to the separate cantonese-v4 project and are not included in this repository change.
