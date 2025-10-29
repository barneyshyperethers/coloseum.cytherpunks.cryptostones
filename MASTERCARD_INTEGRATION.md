# Mastercard Payment Integration

This document explains how to set up and use the Mastercard payment integration in your Crypto Blue Blocks dApp.

## 🚀 Features

- **Pay with Mastercard** button alongside existing Phantom wallet functionality
- **Transak widget integration** for secure fiat-to-crypto payments
- **Smart contract integration** to record payments on-chain
- **Payment history tracking** with both payment methods
- **Beginner-friendly** implementation with minimal configuration

## 📋 Setup Instructions

### 1. Get Transak API Key

1. Visit [Transak.com](https://transak.com/)
2. Sign up for an account
3. Get your API key from the dashboard
4. Update `src/config/transak.ts`:

```typescript
export const TRANSAK_CONFIG = {
  API_KEY: 'your_actual_api_key_here',
  ENVIRONMENT: 'STAGING', // or 'PRODUCTION' for live
  // ... other settings
};
```

### 2. Configure Smart Contract

Update your smart contract program ID in `src/config/transak.ts`:

```typescript
export const SMART_CONTRACT_CONFIG = {
  PROGRAM_ID: 'your_actual_program_id_here',
  RPC_ENDPOINT: 'https://api.mainnet-beta.solana.com',
};
```

### 3. Update Smart Contract Service

In `src/services/SmartContractService.ts`, replace the mock implementation with your actual smart contract call:

```typescript
// Replace the mock implementation with real smart contract interaction
const confirmOffchainPayment = async (paymentId: string, status: string): Promise<string> => {
  // Your actual smart contract interaction code here
  // This should call the confirm_offchain_payment method
};
```

## 🎯 How It Works

### Payment Flow

1. **User clicks "Pay with Mastercard"** → Transak widget opens
2. **User completes payment** → Transak processes the fiat payment
3. **Payment success** → Smart contract `confirm_offchain_payment` is called
4. **On-chain confirmation** → Payment is recorded on Solana blockchain
5. **Success callback** → User sees confirmation and payment is tracked

### Components

- **`MastercardPayment`**: Main payment component with Transak integration
- **`PaymentContext`**: Manages payment history and state
- **`SmartContractService`**: Handles on-chain payment confirmation
- **Configuration**: Centralized settings for Transak and smart contract

## 🔧 Usage Examples

### Basic Usage

```tsx
import MastercardPayment from './components/MastercardPayment';

<MastercardPayment
  amount={299}
  currency="USD"
  onPaymentSuccess={(paymentId) => console.log('Payment successful:', paymentId)}
  onPaymentError={(error) => console.error('Payment failed:', error)}
/>
```

### With Custom Styling

```tsx
<MastercardPayment
  amount={299}
  currency="USD"
  className="w-full bg-red-600 hover:bg-red-700"
  buttonText="💳 Pay with Mastercard"
  onPaymentSuccess={handleSuccess}
  onPaymentError={handleError}
/>
```

## 🛡️ Security Notes

- **No card data handling**: All payment processing is handled by Transak
- **Secure API keys**: Keep your Transak API key secure and never commit it to version control
- **Environment separation**: Use STAGING for testing, PRODUCTION for live
- **Smart contract validation**: Ensure your smart contract validates payment IDs properly

## 🧪 Testing

### Test Mode

1. Set `ENVIRONMENT: 'STAGING'` in config
2. Use test credit cards provided by Transak
3. Monitor console logs for payment flow
4. Verify smart contract calls in Solana explorer

### Production Mode

1. Set `ENVIRONMENT: 'PRODUCTION'` in config
2. Use real Transak API key
3. Test with small amounts first
4. Monitor payment success rates

## 📊 Payment Tracking

The `PaymentContext` automatically tracks all payments:

```tsx
const { paymentHistory, getPaymentStatus } = usePayment();

// Get payment history
console.log(paymentHistory);

// Check specific payment status
const payment = getPaymentStatus('payment_id_123');
```

## 🔄 Integration with Existing Phantom Flow

The Mastercard payment integration is designed to work alongside your existing Phantom wallet functionality:

- **No changes** to existing Phantom wallet code
- **Same payment callbacks** for both payment methods
- **Unified payment tracking** across both methods
- **Consistent UI/UX** with your existing design

## 🆘 Troubleshooting

### Common Issues

1. **Transak widget not loading**: Check API key and network connectivity
2. **Smart contract call failing**: Verify program ID and RPC endpoint
3. **Payment not confirmed**: Check wallet connection and transaction signing

### Debug Mode

Enable debug logging by adding to your component:

```tsx
useEffect(() => {
  console.log('Transak config:', TRANSAK_CONFIG);
  console.log('Wallet connected:', isConnected);
}, [isConnected]);
```

## 📞 Support

- **Transak Documentation**: [docs.transak.com](https://docs.transak.com/)
- **Solana Documentation**: [docs.solana.com](https://docs.solana.com/)
- **Issues**: Create an issue in your repository for bugs or questions

---

**Note**: This integration is designed to be beginner-friendly while maintaining security best practices. Always test thoroughly before deploying to production.
