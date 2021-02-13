const { Router } = require('express');
const router = Router();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.sk_test)

//Define API routes Here
router.post('/payments', async (req, res) => {
    const { amount } = req.body;

    console.log(amount);
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'aud'
        })
        console.log(paymentIntent.client_secret);

        res.status(200).send(paymentIntent.client_secret)
    } catch (error) {

    }
})

//export router
module.exports = router;