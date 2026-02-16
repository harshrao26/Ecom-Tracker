# Razorpay Integration - Environment Setup

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Razorpay API Keys
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Public key for frontend (same as KEY_ID)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

## How to Get Razorpay Keys

1. Go to [https://dashboard.razorpay.com/](https://dashboard.razorpay.com/)
2. Sign up or log in
3. Navigate to **Settings → API Keys**
4. Click "Generate Test Key" (for development)
5. Copy both Key ID and Key Secret
6. Add them to your `.env.local` file

## Testing

Use these test cards in Razorpay test mode:

**Successful Payment:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failed Payment:**
- Card Number: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

## Payment Flow

1. User selects a plan on homepage
2. If not logged in → Redirects to signup with plan parameter
3. If logged in → Redirects to checkout page
4. User reviews order and clicks "Pay"
5. Razorpay popup opens
6. User completes payment
7. Payment verified on backend
8. Subscription created/updated
9. Order marked as completed
10. User redirected to dashboard

## Files Created

### Configuration
- `src/lib/pricing.config.ts` - Centralized pricing config

### Backend APIs
- `src/app/api/payment/create-order/route.ts` - Creates Razorpay order
- `src/app/api/payment/verify/route.ts` - Verifies payment signature

### Frontend Components
- `src/components/payment/RazorpayButton.tsx` - Payment button component
- `src/app/checkout/page.tsx` - Checkout page with plan details

### Modified Files
- `src/app/page.tsx` - Updated pricing card buttons

## Next Steps

1. Add Razorpay keys to `.env.local`
2. Test payment flow in browser
3. Verify order and subscription creation in database
4. Optional: Add email notifications
5. Optional: Add invoice generation
