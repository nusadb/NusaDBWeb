# NusaDB Web

Website landing page untuk project **NusaDB** — relational database engine yang
ditulis dari nol dalam bahasa Rust.

## Tentang

Website ini adalah halaman pengantar statis (tanpa backend) yang menampilkan:

- **Hero** — value proposition, status proyek (`pre-1.0 · v0.1.0`), lisensi Apache-2.0.
- **Stats** — fakta singkat engine (100% Rust, 8 KB pages, TLS + SCRAM, MVCC).
- **Features** — 6 kartu fitur utama: MVCC Transactions, Storage Engine,
  Write-Ahead Logging, Cost-Based SQL Engine, Rich SQL Features, Secure Wire Protocol.
- **Quickstart** — perintah build & run via Cargo, dengan tombol copy ke clipboard.
- **Docker** — contoh `docker run`, auth (SCRAM-SHA-256), volume, dan init scripts.
- **Docs & Resources** — link ke dokumentasi (nusadb.com), GitHub, Docker Hub, dan CONTRIBUTING.

## Teknologi

- HTML5, CSS3, JavaScript vanila — tanpa framework & tanpa build step.
- CSS Grid/Flexbox + media queries untuk responsive (mobile-first).
- Font: **Space Grotesk** (heading) + **Inter** (body) via Google Fonts CDN.
- Ikon: inline SVG bergaya Lucide (stroke 2px).
- Warna brand: `#4297C8` (biru) dan `#293880` (navy).

## Struktur File

```
├── index.html         # Satu halaman landing (semua section)
├── css/
│   └── style.css      # Styling custom + responsive
└── js/
    └── main.js        # Mobile nav toggle, sticky nav, copy-to-clipboard
```

## Cara Menjalankan

Buka `index.html` langsung di browser, atau jalankan server statis:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

## Logo

Belum ada logo resmi. Saat ini memakai placeholder inline SVG (ikon silinder
database + wordmark "NusaDB"). Jika logo resmi sudah tersedia, ganti SVG pada
bagian yang ditandai komentar `LOGO` di `index.html`.

## Lisensi

Website ini mengikuti lisensi project NusaDB: **Apache-2.0**.
