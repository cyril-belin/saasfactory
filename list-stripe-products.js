
const { Stripe } = require('stripe')
require('dotenv').config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function main() {
    console.log('Fetching products from Stripe...')
    const products = await stripe.products.list({
        expand: ['data.default_price']
    })

    if (products.data.length === 0) {
        console.log('No products found in Stripe.')
        return
    }

    console.log('Found products:')
    products.data.forEach(p => {
        const price = p.default_price
        console.log(`- ${p.name}: ${price ? price.id : 'No default price'} (${price ? price.unit_amount / 100 : 0} ${price ? price.currency : ''})`)
    })
}

main().catch(console.error)
