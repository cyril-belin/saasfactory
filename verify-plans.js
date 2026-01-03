
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('1. Creating a test plan...')
    const plan = await prisma.subscriptionPlan.create({
        data: {
            name: 'Test Plan ' + Date.now(),
            description: 'Created via verification script',
            priceId: 'price_test_' + Date.now(),
            amount: 1000, // 10.00
            currency: 'eur',
            interval: 'month',
            features: ['Feature A', 'Feature B'],
            isActive: true,
            popular: true
        }
    })
    console.log('Plan created:', plan)

    console.log('2. Fetching active plans...')
    const plans = await prisma.subscriptionPlan.findMany({
        where: { isActive: true }
    })
    console.log('Found plans:', plans.length)

    console.log('3. Cleaning up...')
    await prisma.subscriptionPlan.delete({
        where: { id: plan.id }
    })
    console.log('Test plan deleted.')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
