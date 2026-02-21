# Unicorn Memory Match (PWA)

Simple iPad-friendly memory game for kids:

- Tap one card to flip and reveal the image
- Tap a second card
- Matching pair disappears from the board

## Run locally

Because service workers require HTTP(S), use a local server:

```bash
cd /Users/daniel/Code/memory
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## PWA install on iPad

1. Open in Safari.
2. Tap Share.
3. Tap Add to Home Screen.

## Replace unicorn images

Replace files in `/Users/daniel/Code/memory/assets/unicorns/` keeping 10 unique images.

See `/Users/daniel/Code/memory/assets/unicorns/README.md` for specs.
