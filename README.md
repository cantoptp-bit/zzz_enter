# PEGASUS Enter

Static enter/landing page. Deploy to Vercel.

---

## Vercel: make the background video work

The background is an **MP4 file stored with Git LFS**. For the video to load on your Vercel site you **must** enable LFS and redeploy:

1. Go to [vercel.com](https://vercel.com) → your project (**zzz_enter**) → **Settings**
2. Open **Git** in the sidebar
3. Turn **on** **"Git LFS"** (or "Large File Storage")
4. Save, then go to **Deployments** → open the **⋮** menu on the latest deployment → **Redeploy**

If Git LFS is off, Vercel only deploys the small pointer file, so the video never loads and you'll see the fallback image instead.

**If the video still doesn't play after enabling LFS and redeploying:** the deployed file may still be the LFS pointer. Upload the MP4 to [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) (or any CDN), then in `index.html` set the video `<source src="..." />` to that URL (e.g. `https://xxx.blob.vercel-storage.com/14625362_1920_1080_24fps.mp4`). The video is the **default** background; the image only shows when the video fails to load.

---

## Run locally (with video working)

Use the included server so the background video loads (it supports Range requests):

```bash
python3 server.py
```

Then open **http://localhost:8080/index.html** (the root may show a directory listing). Plain `python3 -m http.server 8080` often fails to stream the MP4 because it doesn’t send `206 Partial Content` for Range requests.

