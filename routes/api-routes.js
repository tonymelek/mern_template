const { Router } = require('express');
const router = Router();
const { Client, Environment, ApiError } = require('square');

// Set the Access Token which is used to authorize to a merchant
const accessToken = process.env.token;

const client = new Client({
    environment: Environment.Sandbox,
    accessToken: accessToken,
});

router.post('/process-payment', async (req, res) => {

    const requestParams = req.body;
    console.log(requestParams);
    // Charge the customer's card
    const paymentsApi = client.paymentsApi;
    const requestBody = {
        sourceId: requestParams.nonce,
        amountMoney: {
            amount: requestParams.amount,
            currency: requestParams.currency
        },
        locationId: requestParams.location_id,
        idempotencyKey: requestParams.idempotency_key,
    };

    try {
        const response = await paymentsApi.createPayment(requestBody);
        res.send(`Successfully Paid ${requestParams.amount / 100} ${requestParams.currency}`)
    } catch (error) {
        console.log(error);
        let errorResult = null;
        if (error instanceof ApiError) {
            errorResult = error.errors;
        } else {
            errorResult = error;
        }
        res.status(500).json({
            'title': 'Payment Failure',
            'result': errorResult
        });
    }
});


//export router
module.exports = router;