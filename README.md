# PEGASUS Enter

Static enter/landing page. Deploy to Vercel.

---

## Background video

The background uses a **reliable CDN video** first so it works on Vercel without Git LFS. In `index.html` the `<video>` has multiple `<source>` tags: the first that loads is used. You can change the first `<source src="...">` to your own MP4 URL (e.g. from [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) or a [Pexels direct URL](https://imageurlgenerator.com/pexels-video-direct-url)) if you want a different clip.

---

## Run locally (with video working)

Use the included server so the background video loads (it supports Range requests):

```bash
python3 server.py
```

Then open **http://localhost:8080/index.html** (the root may show a directory listing). Plain `python3 -m http.server 8080` often fails to stream the MP4 because it doesn’t send `206 Partial Content` for Range requests.

