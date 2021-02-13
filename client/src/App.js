import './App.css';
import Checkout from './components/Checkout';
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { pk_test, pk_live } from './config'

function App() {
  const stripePromise = loadStripe(pk_test)

  return (
    <Elements stripe={stripePromise}>
      <div className="App">
        <Checkout />
      </div>
    </Elements>
  );
}

export default App;
