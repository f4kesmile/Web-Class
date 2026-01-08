# 🌐 Web-Class

**Web-Class** adalah aplikasi manajemen kelas berbasis web yang dikembangkan menggunakan **Next.js (App Router)**. Proyek ini dirancang sebagai platform pembelajaran digital yang scalable, menggunakan arsitektur modular dan teknologi modern untuk pengalaman pengguna yang optimal.

> 🛠️ **Status Pengembangan**: Saat ini pengembangan aktif dilakukan pada branch **`features`**.

---

## ✨ Fitur Utama

* **Next.js App Router**: Arsitektur terbaru untuk performa dan routing yang lebih baik.
* **Modular UI Components**: Komponen antarmuka yang dapat digunakan kembali (reusable).
* **Integrasi Prisma ORM**: Manajemen database yang aman dan efisien dengan Type-safety.
* **Middleware Ready**: Sistem keamanan dan pengalihan rute yang sudah terintegrasi.
* **Target Fitur Masa Depan**:
    * 📊 Dashboard Analistik
    * 🔐 Sistem Autentikasi Multi-role
    * 👥 Manajemen User & Siswa
    * 📚 Pengelolaan Materi & Kelas
    * ⚙️ Panel Administrasi

---

## 🧰 Tech Stack

| Teknologi | Peran |
| :--- | :--- |
| **Next.js 15+** | React Framework (App Router) |
| **TypeScript** | Bahasa Pemrograman (Type-Safe) |
| **Prisma ORM** | Object-Relational Mapping |
| **shadcn/ui** | Library Komponen UI |
| **Tailwind CSS** | Styling & Desain Responsif |
| **PostCSS & ESLint** | Standarisasi & Kualitas Kode |

---

## 📁 Struktur Proyek

```text
.
├── actions/           # Logika Server Actions
├── app/               # Struktur Route & Page (App Router)
├── components/        # Komponen UI Reusable
├── hooks/             # Custom React Hooks
├── lib/               # Utility & Helper Functions
├── prisma/            # Schema & Migrasi Database
├── public/            # Aset Statis (Gambar, Icon)
│
├── components.json    # Konfigurasi shadcn/ui
├── middelware.ts      # Middleware (Auth & Guard)
├── next.config.ts     # Konfigurasi Utama Next.js
└── prisma.config.ts   # Konfigurasi Koneksi Prisma

```

---

## 🚀 Memulai Pengembangan (Local)

### 1. Prasyarat

* **Node.js** (Versi LTS sangat direkomendasikan)
* **npm** (Bawaan Node.js)
* **Database** (MySQL, PostgreSQL, atau lainnya yang didukung Prisma)

### 2. Instalasi

```bash
# Clone repository
git clone [https://github.com/f4kesmile/Web-Class.git](https://github.com/f4kesmile/Web-Class.git)

# Masuk ke folder
cd Web-Class

# Pindah ke branch pengembangan
git checkout features

# Install semua dependensi
npm install

```

### 3. Konfigurasi Environment

Buat file bernama `.env` di direktori utama dan sesuaikan koneksi database Anda:

```env
DATABASE_URL="mysql://username:password@localhost:3306/nama_database"

```

### 4. Sinkronisasi Database

```bash
# Sinkronkan skema ke database
npx prisma db push

# Generate Prisma Client
npx prisma generate

```

### 5. Jalankan Aplikasi

```bash
npm run dev

```

Aplikasi dapat diakses melalui: `http://localhost:3000`

---

## 📜 Script Tersedia

| Script | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan server development |
| `npm run build` | Melakukan kompilasi aplikasi untuk produksi |
| `npm run start` | Menjalankan aplikasi hasil build produksi |
| `npm run lint` | Mengecek kualitas kode dengan ESLint |

---

## 🤝 Kontribusi

Kontribusi selalu terbuka! Silakan ikuti langkah berikut:

1. Fork repositori ini.
2. Buat branch fitur baru (`git checkout -b feature/FiturKeren`).
3. Simpan perubahan Anda (`git commit -m 'Menambah Fitur Keren'`).
4. Push ke branch tersebut (`git push origin feature/FiturKeren`).
5. Ajukan Pull Request.

---

## 👤 Author

**f4kesmile** 🔗 [GitHub Profile](https://www.google.com/search?q=https://github.com/f4kesmile)

📂 [Repository Link](https://github.com/f4kesmile/Web-Class)

```
