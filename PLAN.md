# PLAN — Website NusaDB (Landing Page)

> Dokumen perencanaan. Model / developer lain bisa membaca file ini untuk memahami
> keputusan, langkah-langkah, dan konteks project sebelum lanjut mengerjakan.

## 1. Tujuan

Membuat website sederhana (static: HTML + CSS + JS) untuk project **NusaDB**
— sebuah relational database engine yang ditulis dari nol dalam bahasa Rust.

Website ini berfungsi sebagai **landing page / halaman pengantar** yang:
- Menjelaskan apa itu NusaDB (value proposition).
- Menampilkan fitur utama dari README repo resmi.
- Menyediakan akses cepat ke sumber daya: GitHub, dokumentasi (nusadb.com), Docker Hub.
- Menampilkan cara mulai (quickstart / Docker run).
- Responsive (mobile-first), tanpa build step, tanpa backend.

## 2. Sumber Konten (dari repo https://github.com/nusadb/nusadb)

Fakta kunci yang dipakai di website (semua dari README resmi):

- **Status**: pre-1.0 (`0.1.0`). Engine, transaksi, SQL, wire protocol sudah jalan,
  tapi API & format on-disk masih bisa berubah sebelum 1.0.
- **Fitur utama**:
  - MVCC transactions — Serializable Snapshot Isolation, 4 level isolasi standar,
    savepoints, rollback.
  - Storage engine clustered B-link/B+tree — 8 KB pages, buffer pool clock-eviction,
    row locks tanpa wait.
  - Write-ahead logging (WAL) dengan crash recovery — CRC32 per record, kompresi lz4.
  - SQL engine berbasis cost — parser (sqlparser-rs), analyzer, planner dengan
    histogram/MCV stats, prediksi/projection pushdown, executor.
  - Window functions, recursive CTE, subqueries, set operations, MERGE, views, sequences.
  - Tipe data: numerik, temporal, JSON, array, UUID; NUMERIC eksak basis-10.
  - Wire protocol biner di atas TCP dengan TLS (rustls) dan SCRAM-SHA-256,
    simple & extended (prepared statement) query, COPY.
- **Build**: Rust toolchain `rust-toolchain.toml` (Rust 1.95.0, edition 2024).
- **Run (cargo)**:
  - Server: `cargo run -p nusadb-server -- --listen 127.0.0.1:5678 --data-dir ./data`
  - CLI: `cargo run -p nusadb-cli -- --host 127.0.0.1:5678`
- **Docker**: image `nusadb/nusadb` di Docker Hub (linux/amd64), volume di
  `/var/lib/nusadb`, env `NUSADB_USER` + `NUSADB_PASSWORD` untuk SCRAM.
- **Lisensi**: Apache-2.0.
- **Website resmi dokumentasi**: https://nusadb.com

## 3. Identitas Visual

- **Warna primer (brand)**: `#4297C8` (biru langit / cyan-blue)
- **Warna sekunder (gelap)**: `#293880` (biru navy)
- Dukungan palet (turunan, untuk kontras/aksen):
  - `#1e2b61` (navy lebih gelap, untuk hover/header)
  - `#6fb3d9` (biru muda, untuk hover/highlight)
  - `#f4f8fb` (latar terang section)
- **Logo**: belum ada. Digunakan placeholder berbasis teks — ikon silinder database
  (inline SVG) + wordmark "NusaDB". SVG memastikan tidak butuh file gambar eksternal.
- **Font (modern)**: `Space Grotesk` untuk heading/display + `Inter` untuk body,
  dimuat via Google Fonts CDN dengan `display=swap`. Fallback ke system-ui bila offline.
- **Ikon**: gaya Lucide (stroke 2px, rounded), semua inline SVG — konsisten & modern.
  Butuh koneksi hanya untuk font; ikon tetap embed di HTML.

## 4. Struktur File

```
E:\WebNusaDB\
├── PLAN.md            <- dokumen ini (rencana & panduan model lain)
├── index.html         <- satu halaman landing (semua section ada di sini)
├── css\
│   └── style.css      <- semua styling custom (brand color, layout, responsive)
└── js\
    └── main.js        <- interaksi: mobile nav toggle, smooth scroll, navbar shadow
```

Catatan: struktur HTML sudah dibuat semantic; font & ikon dimuat via CDN Google Fonts,
bagian layout tetap zero-framework dan self-contained. Kalau nanti ingin tambah
Tailwind/Bootstrap, tinggal tambah link di `<head>`.

## 5. Halaman & Section (index.html)

1. **Header / Navbar**
   - Logo placeholder (SVG silinder + "NusaDB").
   - Menu: Features, Quickstart, Docker, Docs.
   - Tombol CTA: "GitHub".
   - Mobile: hamburger menu (toggle via JS).
   - Sticky, transparan, lalu ber-shadow saat scroll.

2. **Hero**
   - Judul: "NusaDB — Relational Database Engine".
   - Subtitle singkat yang menjelaskan value proposition.
   - CTA: "Get Started" (scroll ke quickstart) + "View on GitHub".
   - Badge status: `pre-1.0 · v0.1.0` dan `Apache-2.0`.
   - Background gradient brand (`#4297C8` → `#293880`).

3. **Stats strip** (ringan, dari repo)
   - Rust-written / B-link B+tree / 8KB pages / TLS + SCRAM.

4. **Features** (grid kartu)
   - MVCC Transactions
   - Storage Engine
   - Write-Ahead Logging & Crash Recovery
   - Cost-Based SQL Engine
   - Rich Type System
   - Secure Wire Protocol

5. **Quickstart** (perintah yang bisa di-copy)
   - Build via Cargo
   - Run server + CLI
   - Tabs atau blok terpisah; tombol copy ke clipboard.

6. **Docker**
   - Perintah `docker run` + env + volume.
   - Link ke Docker Hub.

7. **Docs & Resources**
   - Kartu link: GitHub, Documentation (nusadb.com), Docker Hub, Contributing.

8. **Footer**
   - Logo kecil, ringkasan lisensi (Apache-2.0), link GitHub, copyright.

## 6. Langkah Implementasi (urutan)

1. ✅ Riset konten dari repo GitHub (done).
2. ✅ Tulis PLAN.md ini (done).
3. Buat `css/style.css` — CSS variables brand, reset, layout, komponen, responsive.
4. Buat `js/main.js` — mobile nav toggle, scroll shadow, smooth scroll, copy-to-clipboard.
5. Buat `index.html` — kerangka + semua section di atas, tautan file css/js.
6. Verifikasi:
   - Buka file lokal di browser (pastikan tidak ada 404 file css/js).
   - Cek responsive pada lebar desktop / tablet / mobile (media queries).
   - Pastikan semua link eksternal valid (github, nusadb.com, docker hub).
   - (Opsional) run lint HTML bila alat tersedia.

## 7. Catatan untuk Model / Developer Berikutnya

- Jangan menambahkan dependensi eksternal tanpa konfirmasi — project ini sengaja
  zero-dependency untuk kemudahan hosting static.
- Update konten fitur/fakta dari README repo apabila ada rilis baru (mis. v1.0).
- Jika logo resmi tersedia nanti: simpan di `img/logo.svg` dan ganti inline SVG
  di header/footer (cari komentar `LOGO`).
- Bahasa halaman: **English** (audiens umum open-source), komentar kode minimal.
  Semua komunikasi antar dev bisa memakai Bahasa Indonesia seperti dokumen ini.
- Todo / status masing-masing langkah bisa dilihat dari checklist di section 6.
