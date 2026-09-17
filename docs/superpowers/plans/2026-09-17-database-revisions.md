# Database revisions implementation plan

**Goal:** Apply all database requirements in 07.13, 07.26 and 08.04, push main, verify deployed choral.cantonesecomposition.com.
**Architecture:** Retain the existing React/Vite app and published-sheet source. Centralise duration/media/sort predicates in a tested catalogue utility; extend existing filter state and sidebar. Preserve existing card artwork with consistent year badges.
**Spec:** Google Doc 1oFJ9PTpMEJ6uRizigfTtcXkWyXxv5wNVqHYaZ5bYJ5I, all three revision tabs and embedded images inspected.

- [x] Add regression tests for duration formatting/filtering (default 0–6, 0.5 step, minimum upper bound 1, 10+ open-ended, unknown always included), media availability and numeric ID sorting.
- [x] Implement catalogue helpers; apply combined filters and four sort choices (year and ID each direction, no title sort).
- [x] Add Explore checkboxes and two-ended duration slider; reset restores 0–6. Both Explore selections require both resources.
- [x] Update branding: raise 合 glyph, uppercase gold English name, grey Powered by and purple research link, Inter non-title English.
- [x] Place year badge consistently on all four covers, replace card media status with year/duration; numeric duration + min and unknown = unspecified also in modal.
- [x] Apply exact voice labels and Instruments; verify prior keyword/composer search and accompaniment behaviour.
- [x] Run test/typecheck/build; Chrome test real-sheet flows and mobile layout; review all requirements.
- [x] Push main, observe deployment and verify the same flows on production; record evidence.
