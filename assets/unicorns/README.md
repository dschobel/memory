# Unicorn asset guide

The game expects 10 unique files named:

- `unicorn-01.svg`
- `unicorn-02.svg`
- `unicorn-03.svg`
- `unicorn-04.svg`
- `unicorn-05.svg`
- `unicorn-06.svg`
- `unicorn-07.svg`
- `unicorn-08.svg`
- `unicorn-09.svg`
- `unicorn-10.svg`

## Best format

Use **SVG** when possible.

- Scales cleanly on iPad and high-DPI screens.
- Usually smaller file size for simple illustrations.
- Easy to recolor/edit.

If you prefer raster art, use PNG or WebP and keep the same filenames with matching extensions, then update `unicornAssets` in `/Users/daniel/Code/memory/app.js`.

## Suggested art spec

- Canvas ratio: `3:4` (example: `600x800`)
- Visual style: bold shapes and high contrast for quick recognition
- Keep important details centered to avoid clipping
- Avoid tiny text/details that are hard to read on small cards

## Licensing

If using downloaded icon packs, verify they allow app usage (including redistribution).
