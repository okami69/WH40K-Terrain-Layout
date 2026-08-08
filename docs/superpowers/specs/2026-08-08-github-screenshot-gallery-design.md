# GitHub Screenshot Gallery Design

## Goal

Show prospective users what the English application looks like before they download it.

## Gallery

- Add four 768 x 1080 PNG screenshots under `docs/screenshots/`.
- Show different Force Disposition matchups and terrain layouts A, B, and C.
- Keep the full compact application sheet visible in every image.
- Show a left mission summary in one image and a right mission summary in another.
- Present the four images in a two-column README gallery with concise English captions.

## Constraints

- Capture the real packaged frontend with Playwright; do not mock or retouch the UI.
- Keep the interface in English and avoid browser chrome.
- Do not change application behavior or add runtime dependencies.

## Verification

- A repository test asserts that all four PNG files exist and are referenced by README.
- Visually inspect every screenshot for correct language, selected layout, map, and popover placement.

