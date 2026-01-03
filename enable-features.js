
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    await prisma.featureFlag.update({
        where: { key: 'storage' },
        data: { enabled: true }
    })

    await prisma.featureFlag.update({
        where: { key: 'changelog_in_app' },
        data: { enabled: true }
    })

    console.log('Features enabled!')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
