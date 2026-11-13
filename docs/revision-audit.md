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

## Production verification

Revision a8998f9 reached the production domain through automatic deployment after push. Chrome confirmed 233 default works, 61 audio, 34 score, 2 both, IDs 286/001 at the two entry-sort extremes, all 286 at 10+, and correct modal links/duration. The final 390px production check found a long voice label overflowing its card; the follow-up constrains that badge while preserving its complete text in the detail modal.


## Duration default follow-up — 2026-11-13

Professor requested default 0–10+. Updated initial state, sidebar Reset and empty-results Clear Filters from [0, 6] to [0, 10]; 10 remains open-ended. Supersedes the historical 0–6 requirement above. Chrome localhost verified initial 286 results, narrowing to 6, Reset to 0–10+ / 286, no-match search then Clear Filters to 0–10+ / 286. Six tests / 32 assertions, typecheck, production build and diff check passed. Main push authorized; deployment not yet verified. Companion art-song update renames Audio Available to With Audio and matches the score label font; its local filter/reset checks and four tests passed.

Release outcome: choral `66ac9ad` and art-song `2d10ced` successfully pushed to their respective origin/main branches. Immediate live checks still show previous assets/text; deployment verification pending.


## Shared Creative Suite release — 2026-11-13 evening

Sibling cantonese-v4 `0136a1c` is pushed and Render/live-browser verified at app.cantonesecomposition.com. Converter/checker use the professor’s piano-input mockup; About hidden from navigation, full checker name and revised centered copy/results applied. All three tools allow exact 636/656 (+1, −3) / (+3, −1) exceptions; checker alone allows −1 for 11/12/21/22. 60 tests and app build passed, live generator/converter/checker flows and 390px checker passed with loaded scores/no overflow. Full evidence and screenshot checklist are in cantonese-v4/docs/. No database code or sheet changed. WhatsApp draft prepared for user review; no message sent.
