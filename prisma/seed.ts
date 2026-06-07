// prisma/seed.ts
import 'dotenv/config'
import { prisma } from '../lib/prisma'

async function main() {
  console.log('🌱 Memulai proses seeding database...')

  // 1. Bersihkan data lama (opsional, hati-hati jika di production)
  // await prisma.activityLog.deleteMany()
  // await prisma.announcement.deleteMany()
  // await prisma.officer.deleteMany()
  // await prisma.gallery.deleteMany()
  // await prisma.agenda.deleteMany()
  // await prisma.schedule.deleteMany()
  // await prisma.siteSettings.deleteMany()
  
  // 2. Buat Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'default-settings' },
    update: {},
    create: {
      id: 'default-settings',
      siteName: 'Portal Kelas Informatika',
      description: 'Website resmi untuk manajemen jadwal, tugas, dan galeri kelas.',
      className: 'Informatika 4C',
      semester: '4',
      academicYear: '2025/2026',
      supportEmail: 'support@webkelas.com',
      instagram: '@kelas_informatika',
    }
  })

  // 3. Buat Dummy Users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@webkelas.com' },
    update: {},
    create: {
      name: 'Admin Kelas',
      email: 'admin@webkelas.com',
      emailVerified: true,
      role: 'SUPER_ADMIN',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    }
  })

  const userKetua = await prisma.user.upsert({
    where: { email: 'ketua@webkelas.com' },
    update: {},
    create: {
      name: 'Budi Santoso (Ketua)',
      email: 'ketua@webkelas.com',
      emailVerified: true,
      role: 'ADMIN',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
    }
  })

  const userBendahara = await prisma.user.upsert({
    where: { email: 'bendahara@webkelas.com' },
    update: {},
    create: {
      name: 'Siti Aminah (Bendahara)',
      email: 'bendahara@webkelas.com',
      emailVerified: true,
      role: 'ADMIN',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
    }
  })

  // 4. Buat Officers (Pengurus Kelas)
  await prisma.officer.createMany({
    data: [
      { position: 'Ketua Kelas', displayOrder: 1, userId: userKetua.id },
      { position: 'Bendahara', displayOrder: 2, userId: userBendahara.id },
    ],
    skipDuplicates: true
  })

  // 5. Buat Jadwal (Schedule)
  await prisma.schedule.createMany({
    data: [
      { day: 'MONDAY', startTime: '08:00', endTime: '10:00', subject: 'Algoritma Pemrograman', lecturer: 'Pak Budi, M.Kom', room: 'Lab 1', credits: 3 },
      { day: 'MONDAY', startTime: '10:30', endTime: '12:00', subject: 'Bahasa Inggris', lecturer: 'Miss Sarah, M.Pd', room: 'R-204', credits: 2 },
      { day: 'TUESDAY', startTime: '09:00', endTime: '11:00', subject: 'Basis Data', lecturer: 'Bu Ani, M.Kom', room: 'Lab 3', credits: 3 },
      { day: 'WEDNESDAY', startTime: '13:00', endTime: '15:30', subject: 'Pemrograman Web', lecturer: 'Pak Hendra, M.T', room: 'Lab 2', credits: 3 },
      { day: 'THURSDAY', startTime: '08:00', endTime: '10:00', subject: 'Kecerdasan Buatan', lecturer: 'Prof. Rudi', room: 'R-101', credits: 3 },
    ],
    skipDuplicates: true
  })

  // 6. Buat Agenda / Tugas / Ujian
  await prisma.agenda.createMany({
    data: [
      { title: 'Project Akhir Web', subject: 'Pemrograman Web', deadline: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), type: 'ASSIGNMENT', description: 'Buat web menggunakan Next.js dan TailwindCSS', createdBy: adminUser.name },
      { title: 'Ujian Tengah Semester', subject: 'Kalkulus', deadline: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000), type: 'EXAM', description: 'Materi Bab 1 sampai Bab 4. Boleh bawa kalkulator.', createdBy: adminUser.name },
      { title: 'Makalah Kelompok', subject: 'Kecerdasan Buatan', deadline: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), type: 'ASSIGNMENT', description: 'Kumpulkan makalah format PDF di Google Drive.', createdBy: adminUser.name },
      { title: 'Kerja Bakti Lab', subject: 'Umum', deadline: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000), type: 'EVENT', description: 'Semua mahasiswa wajib hadir membersihkan Lab 1.', createdBy: userKetua.name },
    ],
    skipDuplicates: true
  })

  // 7. Buat Pengumuman (Announcement)
  await prisma.announcement.createMany({
    data: [
      { title: 'Perubahan Jadwal UTS', content: 'Ujian Tengah Semester untuk mata kuliah Basis Data diundur menjadi minggu depan.', isActive: true, authorId: adminUser.id },
      { title: 'Pengumpulan Uang Kas', content: 'Harap segera melunasi uang kas bulan ini ke Bendahara. Batas waktu hari Jumat.', isActive: true, authorId: userBendahara.id },
    ],
    skipDuplicates: true
  })

  // 8. Buat Galeri (Gallery)
  await prisma.gallery.createMany({
    data: [
      { title: 'Makrab Angkatan 2024', description: 'Kegiatan Malam Keakraban di Puncak, Bogor.', imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000&auto=format&fit=crop', eventDate: new Date('2025-01-15') },
      { title: 'Kunjungan Industri', description: 'Kunjungan ke kantor pusat Tech Company di Jakarta.', imageUrl: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=1000&auto=format&fit=crop', eventDate: new Date('2025-02-10') },
      { title: 'Juara 1 Lomba Coding', description: 'Tim kelas kita berhasil memenangkan hackathon kampus!', imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1000&auto=format&fit=crop', eventDate: new Date('2025-03-01') },
    ],
    skipDuplicates: true
  })

  // 9. Buat Activity Log (Dummy Log)
  await prisma.activityLog.createMany({
    data: [
      { action: 'UPDATE_SETTINGS', details: 'Updated class name to Informatika 4C', ipAddress: '192.168.1.1', userId: adminUser.id },
      { action: 'CREATE_ANNOUNCEMENT', details: 'Created announcement: Perubahan Jadwal UTS', ipAddress: '192.168.1.2', userId: adminUser.id },
      { action: 'LOGIN', details: 'User logged in successfully', ipAddress: '192.168.1.3', userId: userKetua.id },
    ],
    skipDuplicates: true
  })

  console.log('✅ Seeding selesai! Seluruh tabel utama telah diisi data dummy.')
  console.log('------------------------------------------------------------')
  console.log('Catatan untuk Autentikasi:')
  console.log('Better-Auth melakukan hashing password di tabel terpisah (Account / Credential).')
  console.log('Karena seed ini tidak mengenerate hash password, user di atas HANYA UNTUK TAMPILAN (Gallery, Officer, dll).')
  console.log('Jika Anda ingin login ke web, silakan REGISTER dari UI website menggunakan email baru,')
  console.log('lalu ubah role-nya menjadi SUPER_ADMIN melalui database (Neon console) atau script.')
  console.log('------------------------------------------------------------')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })