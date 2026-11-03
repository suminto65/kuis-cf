# Kuis Cloudflare — Tahap 1
Berjalan sebagai **Cloudflare Worker + static assets** (alamat *.workers.dev), atau sebagai Pages (folder `functions`).

## Deploy sebagai Worker (yang dipakai sekarang)
1. Ganti isi repo GitHub dengan isi folder ini (wrangler.jsonc, src/, functions/, public/).
2. Cloudflare otomatis build ulang. Nama Worker di wrangler.jsonc harus sama dengan nama Worker di dashboard (`kuis-cf`).
3. Workers AI dan KV (QUIZ_KV) sudah didaftarkan di wrangler.jsonc. Jika deploy menolak KV tanpa id: buka Storage & Databases → KV, salin ID namespace, isikan sebagai "id" di wrangler.jsonc.
4. Settings → Variables and Secrets: secret `ACCESS_CODE` (tetap tersimpan antar deploy).
