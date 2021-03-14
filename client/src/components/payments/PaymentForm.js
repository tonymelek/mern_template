import { useState } from 'react'
import axios from 'axios'
import { uuid } from 'uuidv4'
import {
    SquarePaymentForm,
    CreditCardNumberInput,
    CreditCardExpirationDateInput,
    CreditCardPostalCodeInput,
    CreditCardCVVInput,
    CreditCardSubmitButton
} from 'react-square-payment-form'
import 'react-square-payment-form/lib/default.css'
import './PaymentForm.css'
export default function PaymentForm() {

    const amount = 77;
    const currency = 'AUD';
    const location_id = 'LQ7HA56KWK1S9'
    const idempotency_key = uuid();

    const [errorMessages, setErrorMessages] = useState([])

    const cardNonceResponseReceived = (errors, nonce, cardData, buyerVerificationToken) => {
        if (errors) {
            setErrorMessages(errors.map(error => error.message))
            return
        }
        setErrorMessages([])
        // alert("nonce created: " + nonce + ", buyerVerificationToken: " + buyerVerificationToken) //replace with API call to backend
        axios({
            method: 'post',
            url: '/api/process-payment',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',

            },
            data: {
                nonce,
                amount: amount * 100,
                currency,
                location_id,
                idempotency_key
            }
        }).then(response => console.log(response))
            .catch(err => console.log(err))


    }

    const createVerificationDetails = () => {
        return {
            amount: (amount * 100).toString(),
            currencyCode: currency,
            intent: "CHARGE",
            billingContact: {
                familyName: "Smith",
                givenName: "John",
                email: "jsmith@example.com",
                country: "AU",
                city: "London",
                addressLines: ["1235 Emperor's Gate"],
                postalCode: "SW7 4JA",
                phone: "020 7946 0532"
            }
        }
    }
    return (
        <div>

            <div className="pay-form">
                <SquarePaymentForm
                    sandbox={true}
                    applicationId={`sandbox-sq0idb-doP_EqgyZSsdgQb4CrR2Jw`}
                    locationId={location_id}
                    cardNonceResponseReceived={cardNonceResponseReceived}
                    createVerificationDetails={createVerificationDetails}
                >
                    <fieldset className="sq-fieldset">
                        <CreditCardNumberInput />
                        <div className="line-2">
                            <div className="sq-form-third">
                                <CreditCardExpirationDateInput />
                            </div>

                            <div className="sq-form-third">
                                <CreditCardCVVInput />
                            </div>
                        </div>
                    </fieldset>
                    <div onClick={() => console.log('Tonton is the best man')}>
                        <CreditCardSubmitButton >
                            Pay ${amount}
                        </CreditCardSubmitButton>
                    </div>

                </SquarePaymentForm>
            </div>
            <div className="sq-error-message text-center">
                {errorMessages.map(errorMessage =>
                    <p key={`sq-error-${errorMessage}`}>{errorMessage}</p>
                )}
            </div>

        </div>
    )
}
