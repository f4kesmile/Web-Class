# Portal Kelas Masa Depan (Web Kelas)

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Framework](https://img.shields.io/badge/Next.js-16-black)
![Database](https://img.shields.io/badge/Prisma-MySQL-blue)
![Styling](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

Portal Kelas Masa Depan adalah platform manajemen kelas modern yang dirancang untuk memfasilitasi kebutuhan administrasi, informasi, dan interaksi dalam lingkungan kelas perkuliahan maupun sekolah. Dibangun dengan teknologi web terbaru, platform ini menawarkan pengalaman pengguna yang cepat, responsif, dan estetis.

---

## ✨ Fitur Utama

### 1. 🏠 Landing Page Modern

- **Hero Section dengan Parallax**: Tampilan awal yang memukau dengan efek _Gemini_ dan _Parallax Cover_ yang responsif di Mobile dan Desktop.
- **Galeri Kegiatan**: Carousel interaktif (Apple Cards style) untuk menampilkan dokumentasi kegiatan kelas.
- **Agenda Terdekat**: Informasi ringkas mengenai tugas atau ujian yang akan datang.
- **Jadwal Hari Ini**: Menampilkan mata kuliah atau jadwal pelajaran yang aktif pada hari tersebut.

### 2. 🔐 Autentikasi & Otorisasi Lengkap

- **Sistem Login Aman**: Menggunakan `Better Auth` untuk keamanan maksimal.
- **Role-Based Access Control (RBAC)**:
  - **User**: Siswa/Mahasiswa biasa. Hanya bisa melihat konten.
  - **Admin**: Pengurus kelas. Bisa membuat agenda, jadwal, pengumuman, dan mengirim email reminder.
  - **Super Admin**: Hak akses penuh. Bisa mengubah role user lain, melakukan _banning_ user, dan melihat log aktivitas sensitif.

### 3. 📊 Dashboard Manajemen

- **Statistik Ringkas**: Ringkasan jumlah siswa, agenda aktif, dan keuangan (opsional).
- **Manajemen User**:
  - Daftar seluruh anggota kelas.
  - Filter pencarian cepat.
  - **Promote/Demote Role**: Mengangkat admin/pengurus baru.
  - **Ban/Unban System**: Memblokir akses user yang bermasalah.
- **Manajemen Agenda**: CRUD (Create, Read, Update, Delete) untuk Tugas, Ujian, dan Acara.
- **Manajemen Jadwal**: Pengaturan jadwal mata kuliah mingguan dengan detail ruangan dan dosen.
- **Struktur Organisasi**: Visualisasi dan pengaturan anggota pengurus kelas (Ketua, Wakil, dll).

### 4. 📢 Sistem Pengumuman (Broadcast)

- **Global Banner**: Pengumuman penting yang muncul sebagai _banner_ di seluruh halaman website.
- **Real-time Toggle**: Admin bisa mengaktifkan/mematikan pengumuman kapan saja.

### 5. 🛠️ Utilitas & Tools

- **Email Reminder**: Admin bisa mengirim email pengingat (notifikasi resmi) ke siswa tertentu langsung dari dashboard.
- **Activity Logs**: Pencatatan riwayat aktivitas admin (siapa mengubah apa) untuk audit dan transparansi keamanan.
- **Theme Support**: Dukungan penuh Dark Mode dan Light Mode.

---

## 🛠️ Teknologi yang Digunakan

Project ini dibangun di atas stack modern untuk menjamin performa, keamanan, dan kemudahan pengembangan (DX).

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MySQL](https://www.mysql.com/) / [MariaDB](https://mariadb.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Aceternity UI](https://ui.aceternity.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Auth**: [Better Auth](https://www.better-auth.com/)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **Icons**: [Lucide React](https://lucide.dev/) & [Tabler Icons](https://tabler-icons.io/)

---

## 🚀 Panduan Instalasi (Getting Started)

Ikuti langkah-langkah berikut untuk menjalankan project ini di komputer lokal Anda.

### Prasyarat

- [Node.js](https://nodejs.org/) (Versi 20 ke atas disarankan)
- [MySQL](https://www.mysql.com/) atau MariaDB yang sudah berjalan.

### 1. Clone Repository

```bash
git clone https://github.com/username/website-kelas.git
cd website-kelas
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment Variable

Buat file `.env` di root project. Anda bisa mencontek format di bawah ini:

**File: `.env`**

```env
# Database Configuration
# Ganti user, password, dan nama database sesuai settingan MySQL lokal Anda
DATABASE_URL="mysql://root:password@localhost:3306/web_kelas"

# Better Auth Configuration
# Generate secret acak (bisa pakai 'openssl rand -base64 32')
BETTER_AUTH_SECRET="random_secret_string_min_32_chars"
BETTER_AUTH_URL="http://localhost:3000"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# SMTP Configuration (Untuk fitur email)
# Contoh menggunakan Gmail App Password
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="emailmudisini@gmail.com"
SMTP_PASSWORD="app_password_gmail"

# Super Admin Security
# Masukkan email developer/pemilik agar tidak bisa dihapus/ban oleh admin lain
SUPERADMIN_IMMUTABLE_EMAILS="developer@gmail.com,ketua@gmail.com"
```

### 4. Setup Database

Jalankan perintah prisma untuk melakukan push skema ke database MySQL Anda.

```bash
npx prisma db push
```

_(Opsional)_ Jika ingin melihat/mengedit data secara visual:

```bash
npx prisma studio
```

### 5. Jalankan Server Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 📂 Struktur Project

Berikut adalah gambaran umum struktur folder project ini:

```
website/
├── actions/            # Server Actions (Back-end logic)
│   ├── agenda.ts       # Logic Agenda
│   ├── gallery.ts      # Logic Galeri
│   ├── settings.ts     # Logic User & Settings
│   └── ...
├── app/                # Next.js App Router
│   ├── (auth)/         # Halaman Sign In / Sign Up
│   ├── (protected)/    # Halaman Dashboard (Perlu Login)
│   ├── api/            # API Routes (jika ada)
│   ├── layout.tsx      # Root Layout
│   └── page.tsx        # Landing Page Utama
├── components/         # Komponen React (UI)
│   ├── dashboard/      # Komponen khusus Dashboard
│   ├── landing/        # Komponen Landing Page (Hero, Agenda, dll)
│   ├── ui/             # Reusable UI Components (Button, Input, dll)
│   └── ...
├── lib/                # Utility & Config
│   ├── auth.ts         # Helper Auth
│   ├── mail.ts         # Konfigurasi Nodemailer
│   ├── prisma.ts       # Instance Prisma Client
│   └── utils.ts        # CN utility (Tailwind merge)
├── prisma/             # Konfigurasi Database
│   └── schema.prisma   # Skema Database Lengkap
└── public/             # Aset Statis (Gambar, Icon)
```

---

## 🛡️ Hak Akses (Permissions)

| Fitur                     | User | Admin | Super Admin |
| :------------------------ | :--: | :---: | :---------: |
| Lihat Halaman Depan       |  ✅  |  ✅   |     ✅      |
| Lihat Dashboard Statistik |  ❌  |  ✅   |     ✅      |
| Upload Foto Galeri        |  ❌  |  ✅   |     ✅      |
| Buat/Edit Agenda & Jadwal |  ❌  |  ✅   |     ✅      |
| Kirim Email Broadcast     |  ❌  |  ✅   |     ✅      |
| Edit Pengaturan Situs     |  ❌  |  ✅   |     ✅      |
| Ban/Unban User Lain       |  ❌  |  ❌   |     ✅      |
| Ubah Role User (Promote)  |  ❌  |  ❌   |     ✅      |

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Jika Anda menemukan **bug** atau ingin menambahkan **fitur baru**:

1.  **Fork** repository ini.
2.  Buat branch fitur baru (`git checkout -b fitur-keren`).
3.  Commit perubahan Anda (`git commit -m 'Menambahkan fitur keren'`).
4.  Push ke branch tersebut (`git push origin fitur-keren`).
5.  Buat **Pull Request**.

---

## 📝 Lisensi

Project ini dibuat untuk keperluan pendidikan dan manajemen kelas. Silakan digunakan dan dimodifikasi sesuai kebutuhan.

---

**Dibuat dengan ❤️ oleh Tim Developer Kelas.**
