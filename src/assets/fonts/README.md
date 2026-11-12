# Licensed Font Files (`Aeonik`)

Place your licensed **Aeonik** WOFF2 files from CoType Foundry in this folder:

- `Aeonik-Light.woff2` (300 — optional)
- `Aeonik-Regular.woff2` (400 — primary body & display)
- `Aeonik-Medium.woff2` (500 — buttons, navigation, wordmark)

Then uncomment the `localFont` block in `src/lib/fonts.ts` and return `aeonik.variable` alongside `ibmPlexMono.variable` in `getFontVariables()`.
