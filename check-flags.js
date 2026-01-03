
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const flags = await prisma.featureFlag.findMany()
    console.log('Feature Flags:', flags)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
