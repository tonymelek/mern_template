import React, { useState } from 'react'
import './Checkout.css'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
// import { loadStripe } from '@stripe/stripe-js'
// import { pk } from '../config'
import axios from 'axios'
export default function Checkout() {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcesing] = useState(false)

    const handlePayment = async (e) => {
        e.preventDefault();

        setIsProcesing(true)
        try {
            const clientSecret = await axios({
                method: 'post',
                url: '/api/payments',
                data: {
                    amount: 500
                }
            })
            console.log(clientSecret.data);

            const billingInfo = {
                name: e.target.name.value
            }
            const paymentMethod = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
                billing_details: billingInfo
            });
            console.log(paymentMethod.paymentMethod.id);
            const confirmPayment = await stripe.confirmCardPayment(clientSecret.data, {
                payment_method: paymentMethod.paymentMethod.id
            })
            console.log(confirmPayment);
            setIsProcesing(false)
        } catch (err) {
            console.log(err);
        }

    }

    return (

        <div className="Checkout__main">

            <form className="paymentForm" onSubmit={handlePayment}>
                <label htmlFor="name" placeholder="John Smith">Name</label><br />
                <input type="text" name="name" id="name" required /><br />

                <div className="card-details">
                    <CardElement
                        options={{
                            hidePostalCode: true,
                            style: {
                                base: {
                                    fontSize: '1.2rem',

                                }
                            }
                        }}
                    />
                </div>
                <button type="submit" disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
            </form>


        </div >

    )
}
