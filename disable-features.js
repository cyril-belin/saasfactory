
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    await prisma.featureFlag.update({
        where: { key: 'storage' },
        data: { enabled: false }
    })

    await prisma.featureFlag.update({
        where: { key: 'changelog_in_app' },
        data: { enabled: false }
    })

    console.log('Features disabled (Dashboard reset to clean state)')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
