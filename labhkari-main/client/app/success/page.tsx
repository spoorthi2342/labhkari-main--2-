'use client'
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

const Page = () => {
    const searchParams = useSearchParams();
    const success = searchParams ? searchParams.get('success') : null;

    useEffect(() => {
        const handler = async () => {
            const oid = localStorage.getItem('order');
            try {
                await axios.post('/api/order', {
                    "order_id": oid,
                });
            } catch (e) {
                console.log(e);
            }
        };
        if (success) {
            handler();
        }
    }, [success]);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-green-500 mb-4">Order Placed Successfully!</h1>
                <p className="text-lg text-gray-700 mb-6">Your payment has been successfully processed. Your order will be delivered soon.</p>
                <div className="flex justify-center items-center space-x-4">
                    <Link href="/" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Continue Shopping
                    </Link>
                    <Link href="/orders" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        View Orders
                    </Link>
                </div>
            </div>
        </div>
    );
};

const PageWrapper = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <Page />
    </Suspense>
);

export default PageWrapper;
