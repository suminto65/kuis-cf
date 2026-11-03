# Kuis Cloudflare — Tahap 1
1. Unggah folder ini ke repo GitHub baru.
2. Cloudflare → Workers & Pages → Create → Pages → Connect to Git. Build command: kosong. Output directory: `public`.
3. Settings → Bindings (Production): tambah **Workers AI** (nama `AI`) dan **KV namespace** (nama `QUIZ_KV`; buat namespace dulu di Storage & Databases → KV).
4. Settings → Variables and Secrets: tambah secret `ACCESS_CODE` (kode rahasia Bapak).
5. Deploy ulang. Buka alamat *.pages.dev, isi kode akses, buat kuis.
Catatan: drag-and-drop dashboard tidak menjalankan folder `functions`; pakai GitHub atau `wrangler pages deploy public`.
