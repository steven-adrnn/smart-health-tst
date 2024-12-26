// 'use client'

// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
// import { Label } from '@/components/ui/label'
// import { BackButton } from '@/components/BackButton'

// export default function PaymentPage() {
//   const [paymentMethod, setPaymentMethod] = useState('bank_transfer')
//   const [bankName, setBankName] = useState('')
//   const [accountNumber, setAccountNumber] = useState('')
//   const [eWalletNumber, setEWalletNumber] = useState('')

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     // Handle payment logic here
//     console.log('Payment submitted:', { paymentMethod, bankName, accountNumber, eWalletNumber })
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <BackButton />
//       <h1 className="text-3xl font-bold mb-6">Payment</h1>
//       <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
//         <div>
//           <Label className="text-base font-semibold">Select Payment Method</Label>
//           <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="bank_transfer" id="bank_transfer" />
//               <Label htmlFor="bank_transfer">Bank Transfer</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="e_wallet" id="e_wallet" />
//               <Label htmlFor="e_wallet">E-Wallet</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="cod" id="cod" />
//               <Label htmlFor="cod">Cash on Delivery</Label>
//             </div>
//           </RadioGroup>
//         </div>

//         {paymentMethod === 'bank_transfer' && (
//           <>
//             <div>
//               <Label htmlFor="bank-name">Bank Name</Label>
//               <Select value={bankName} onValueChange={setBankName}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select your bank" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="bni">BNI</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label htmlFor="account-number">Account Number</Label>
//               <Input
//                 type="text"
//                 id="account-number"
//                 value={accountNumber}
//                 onChange={(e) => setAccountNumber(e.target.value)}
//                 required
//                 className="mt-1 block w-full"
//                 placeholder="1376001689"
//               />
//             </div>
//           </>
//         )}

//         {paymentMethod === 'e_wallet' && (
//           <div>
//             <Label htmlFor="e-wallet-number">E-Wallet Number</Label>
//             <Input
//               type="text"
//               id="e-wallet-number"
//               value={eWalletNumber}
//               onChange={(e) => setEWalletNumber(e.target.value)}
//               required
//               className="mt-1 block w-full"
//               placeholder="089634198434"
//             />
//           </div>
//         )}

//         <Button type="submit" className="w-full">Complete Payment</Button>
//       </form>
//     </div>
//   )
// }



// app/payment/page.tsx
'use client'

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Addresses from '@/components/Addresses';

const PaymentPage = () => {
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const router = useRouter();

    const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
            alert('Please log in first');
            return;
        }

        const { error } = await supabase.from('orders').insert([
            {
                user_id: session.user.id,
                address,
                payment_method: paymentMethod,
            },
        ]);

        if (error) {
            alert('Error processing payment: ' + error.message);
        } else {
            router.push('/profile');
        }
    };

    return (
        <div>
            <h1>Payment</h1>
            <Addresses onSelectAddress={(selectedAddress: string) => setAddress(selectedAddress)} />
            <form onSubmit={handlePayment}>
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                >
                    <option value="">Select payment method</option>
                     ```typescript
                    <option value="credit_card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                </select>
                <button type="submit">Pay Now</button>
            </form>
        </div>
    );
};

export default PaymentPage;