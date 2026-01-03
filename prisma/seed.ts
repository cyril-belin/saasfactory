// prisma/seed.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed feature flags
  const flags = [
    {
      key: 'multi_tenant',
      name: 'Multi-Tenant',
      description: 'Enable workspace switching and member management',
      enabled: true,
    },
    {
      key: 'analytics',
      name: 'Analytics',
      description: 'Enable analytics tracking',
      enabled: false,
    },
    {
      key: 'changelog_in_app',
      name: 'In-App Changelog',
      description: 'Show changelog widget in dashboard',
      enabled: true,
    },
    {
      key: 'storage',
      name: 'File Storage',
      description: 'Enable file upload and storage features',
      enabled: true,
    },
    {
      key: 'maintenance_mode',
      name: 'Maintenance Mode',
      description: "Si activé, l'application ne sera accessible qu'aux administrateurs.",
      enabled: false,
    },
  ]

  for (const flag of flags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: flag,
      create: flag,
    })
  }

  // Seed welcome announcement
  await prisma.announcement.create({
    data: {
      title: 'Bienvenue sur notre plateforme !',
      content: 'Merci de nous avoir rejoints. Nous sommes ravis de vous compter parmi nous.',
      type: 'ANNOUNCEMENT',
      isPublic: true,
      isPinned: true,
    },
  })

  console.log('✅ Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
