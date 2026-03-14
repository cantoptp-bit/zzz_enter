# PEGASUS Enter

Static enter/landing page. Deploy to Vercel.

---

## Background video

The background uses a **reliable CDN video** first so it works on Vercel without Git LFS. In `index.html` the `<video>` has multiple `<source>` tags: the first that loads is used. You can change the first `<source src="...">` to your own MP4 URL (e.g. from [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) or a [Pexels direct URL](https://imageurlgenerator.com/pexels-video-direct-url)) if you want a different clip.

### Shrinking the local background video (~300 MB → ~20–40 MB)

The file in `background/` is too large for comfortable use. To create a smaller version (720p, no audio) that works without Git LFS:

1. Install ffmpeg: `sudo apt install ffmpeg` (or equivalent on your OS).
2. Run: `./compress-background-video.sh`
3. This creates `background/background-720p.mp4`. The site is already set to use it when present.
4. Optionally remove the original `background/14625362_1920_1080_24fps.mp4` and commit the compressed file so deploys are smaller.

---

## Run locally (with video working)

Use the included server so the background video loads (it supports Range requests):

```bash
python3 server.py
```

Then open **http://localhost:8080/index.html** (the root may show a directory listing). Plain `python3 -m http.server 8080` often fails to stream the MP4 because it doesn’t send `206 Partial Content` for Range requests.

