# ANU — Every step counts

A 45-second, 16:9 product film for website and investor-demo use. The design uses ANU's existing cyan/lime identity, warm off-white and deep teal, large typography, animated interface details, and an original instrumental score. It carries no Y Combinator branding or endorsement claims.

## Deliverables

- `anu-product-film-1080p.mp4` — master, 1920×1080, 30 fps, H.264/AAC, fast start.
- `anu-product-film-web.mp4` — smaller 1080p website encode, H.264/AAC, fast start.
- `index.html` — local review player with chapter navigation and downloads.
- `poster.jpg` — website poster image.
- `anu-original-score.wav` — original stereo instrumental score at 48 kHz.
- `storyboard.json`, `transcript.txt`, `descriptions.vtt` — scene timings and accessible text.
- `render.py` — editable, deterministic animation and audio source.
- `contact-sheet.jpg`, `frame-*.jpg` — visual review frames.

## What the film represents

Feature names were checked against `client/src/pages/MyLearning.js`, `client/src/components/trainee/TraineeDashboard.js`, and the batch/instructor/trainee pages. The film presents learning modules, MindSparks, OB Boosters, practice and interpretation, performance metrics, skill competency, and team coordination.

The interface panels are **stylized feature illustrations**, not footage of the shipping UI. All visible numbers are sample data and are marked as such. There are no customer outcome claims, fabricated testimonials, or clinical efficacy claims. The symbol comes from `client/src/assets/image (3).png`; the ANU wordmark in the video uses typeset text. The film uses no external stock media, licensed songs, or narration. The user must have rights to the existing ANU mark.

## Website integration

Upload the web MP4 and poster alongside your page, then use:

```html
<video controls playsinline preload="metadata" poster="poster.jpg" style="width:100%;aspect-ratio:16/9">
  <source src="anu-product-film-web.mp4" type="video/mp4">
</video>
```

Use the master for presentations and file sharing. The review player is local and nothing has been published or added to the LMS application.

To open the local review player with reliable chapter seeking, run `python marketing/product-video/serve.py` and visit `http://127.0.0.1:8767`. The server binds only to your own computer and supports media byte ranges.

## Re-render

Requires Python 3, Pillow, NumPy, imageio-ffmpeg, and Windows Segoe UI fonts. Install packages into your preferred virtual environment. This workspace also supports the isolated FFmpeg dependency in `scratch/video-deps`.

```powershell
python marketing/product-video/render.py --preview
python marketing/product-video/render.py
```

Scene timing metadata is in `storyboard.json`; layout, visible copy, motion, and music are in `render.py`. If changing duration or scene boundaries, update both the source constants and text tracks. Generate previews first and review the contact sheet before encoding.
