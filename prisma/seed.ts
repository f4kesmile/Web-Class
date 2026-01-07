// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. Buat Jadwal (Schedule) - Bahasa Inggris di DB
  await prisma.schedule.createMany({
    data: [
      { day: 'MONDAY', startTime: '08:00', endTime: '10:00', subject: 'Algoritma Pemrograman', lecturer: 'Pak Budi', room: 'Lab 1' },
      { day: 'MONDAY', startTime: '10:30', endTime: '12:00', subject: 'Bahasa Inggris', lecturer: 'Miss Sarah', room: 'R-204' },
      { day: 'TUESDAY', startTime: '09:00', endTime: '11:00', subject: 'Basis Data', lecturer: 'Bu Ani', room: 'Lab 3' },
    ]
  })

  // 2. Buat Agenda/Tugas
  await prisma.agenda.createMany({
    data: [
      { title: 'Project Akhir Web', subject: 'Pemrograman Web', deadline: new Date('2026-02-20'), type: 'ASSIGNMENT', description: 'Buat web menggunakan Next.js', createdBy: 'System' },
      { title: 'Ujian Tengah Semester', subject: 'Kalkulus', deadline: new Date('2026-02-15'), type: 'EXAM', description: 'Bab 1 sampai Bab 4', createdBy: 'System' },
    ]
  })

  console.log('🌱 Database seeded with festive data!')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })