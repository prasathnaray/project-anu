# ANU — Product in motion (V2)

This revision replaces the original illustrated slide sequence with a product-led demo. Most of the 45-second film is actual UI capture from the local React application: My Learning, topic expansion, MindSparks question viewing, attempt review, Practice and Image Interpretation filters, and the dashboard's performance and skill competency cards.

The edit adds continuous camera zooms and pans, a choreographed cursor based on actual button coordinates, short captions over the interface, fast match cuts, and a new original 120 BPM instrumental with click and transition effects. Intro and outro total six seconds. No narration is used.

## Outputs

- `anu-product-demo-v2-1080p.mp4` — 1080p/30 master, H.264, stereo AAC 48 kHz, fast start.
- `anu-product-demo-v2-web.mp4` — smaller web encode at the same dimensions.
- `poster-v2.jpg`, `v2-contact-sheet.jpg` — poster and review sheet.
- `anu-v2-score.wav` — original music and effects.
- `index.html` — updated review player; run `python marketing/product-video/serve.py`, then open `http://127.0.0.1:8767`.
- `capture-product.cjs` — actual React capture workflow with isolated demo API fixtures.
- `captures/manifest.json` — captured states, control positions, and browser error log.
- `render_v2.py` — camera keyframes, cursor timing, overlays, edit, and music source.
- `transcript-v2.txt`, `descriptions-v2.vtt` — accessible text.

V1 exports and sources remain available.

## Reproduction

Start the existing React app on localhost:3017. With Playwright available to Node, run `node marketing/product-video/capture-product.cjs`. The capture context intercepts all API responses and aborts external HTTP requests. An unsigned local-only fixture token never reaches an authentication service. No production data is read or written.

Then run `python marketing/product-video/render_v2.py --preview`, review the contact sheet, and run `python marketing/product-video/render_v2.py`. Dependencies match V1: Pillow, NumPy, imageio-ffmpeg, and Windows Segoe UI. The only capture styling adjustment is a locally available Segoe UI font fallback; source application files are unchanged.

All names, questions, activity results, and metrics are demo fixtures. Captured UI is real, while pacing and cursor/camera movement are edited. This is a marketing edit of actual screen states, not an unedited live session. Product UI clearly labels demo data.

## Website embed

```html
<video controls playsinline preload="metadata" poster="poster-v2.jpg" style="width:100%;aspect-ratio:16/9">
  <source src="anu-product-demo-v2-web.mp4" type="video/mp4">
</video>
```
