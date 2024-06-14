'use client';
import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { AiOutlineArrowLeft, AiOutlineShoppingCart } from 'react-icons/ai';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import Navbar from '@/Components/Navbar';
import { RxCardStackMinus } from 'react-icons/rx';

declare global {
    interface Window {
        Razorpay: any; // or specify the type if known
    }
}

const PaymentPage: React.FC = () => {
    const searchParams = useSearchParams();
    const amount = searchParams ? parseFloat(searchParams.get('amount') || '0') : 0;
    const gst = searchParams ? parseFloat(searchParams.get('gst') || '0') : 0;
    const shipcost = searchParams ? parseFloat(searchParams.get('shipc') || '0') : 0;
    const count = searchParams ? parseInt(searchParams.get('count') || '0', 10) : 0;

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phoneNumber: '',
        state: '',
        country: '',
        landmark: '',
        pinCode: '',
        city: '',
        paymentMethod: 'qr',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        email: '',
        tag: ''
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => {
        const uid = localStorage.getItem('userId');
        if (uid == '12345') {
            alert('Login to make payments');
            return;
        }
    }, []);

    const handleSubmit = async (orderId: any, email: string, amount: any, amountPaid: any, userId: string | null, shippingAddress: string, phone: string, name: string, state: string, country: string, landmark: string, city: string, tag: string, pinCode: string) => {
        const url = process.env.NEXT_PUBLIC_CLIENT_URL + "/api/addShipway";
        try {
            await axios.post(url, {
                orderId,
                email,
                amount,
                name,
                phone,
                amountPaid,
                userId,
                count,
                shippingAddress,
                state,
                country,
                landmark,
                city,
                tag,
                pinCode
            });
        } catch (error) {
            console.error('Error after successful payment:', error);
        }
    };

    const isFormValid = () => {
        const { name, address, phoneNumber, state, country, pinCode, city, email } = formData;
        return name && address && phoneNumber && state && country && pinCode && city && email;
    };

    const handlePayment = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (formData) {
            const url = process.env.NEXT_PUBLIC_SERVER_URL + "/paytm/getkey";
            const curl = process.env.NEXT_PUBLIC_SERVER_URL + "/paytm/checkout";
            const rurl = process.env.NEXT_PUBLIC_SERVER_URL + "/paytm/paymentverification";

            const { data: { key } } = await axios.get(url);

            const { data: { order } } = await axios.post(curl, {
                amount: amount + shipcost
            });
            console.log(key, order)

            localStorage.setItem('order', order.id);

            const options = {
                key,
                amount: order.amount,
                currency: "INR",
                name: "Labhkari",
                description: "Your paying this amount to Labhkari",
                image: "https://th.bing.com/th/id/R.d19fc8033978f7ba694994af8d413037?rik=S65%2f9ke1xQqbzw&riu=http%3a%2f%2frndr.juniqe-production.juniqe.com%2fmedia%2fcatalog%2fproduct%2fcache%2fx800%2f265%2f132%2f265-132-101P.jpg&ehk=uEsPKOlz8MlF8gJi44a%2fK5tBQJdSlmHy%2fyMcriONBV0%3d&risl=&pid=ImgRaw&r=0",
                order_id: order.id,
                callback_url: rurl,
                prefill: {
                    name: formData.name,
                    contact: formData.phoneNumber,
                    pin: formData.pinCode
                },
                notes: {
                    "address": "Razorpay Corporate Office"
                },
                theme: {
                    "color": "#121212"
                }
            };
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

            await handleSubmit(order.id, formData.email, order.name, order.phoneNumber, localStorage.getItem('userId'), formData.address, formData.phoneNumber, formData.name, formData.state, formData.country, formData.landmark, formData.city, formData.tag, formData.pinCode);

            paymentObject.on("payment.failed", function () {
                alert("Payment failed. Please try again. Contact support for help");
            });
        }
    };

    const handleTagChange = (selectedTag: string) => {
        setFormData({
            ...formData,
            tag: selectedTag
        });
    };

    const handleBackClick = () => {
        window.history.back();
    };

    return (
        <>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            <Navbar onSearch={() => { }} />
            <div className="flex flex-col md:flex-row p-4 md:p-8 bg-gray-50 min-h-screen md:mt-16 mt-36 mb-10">
                <div className="w-full md:w-2/3">
                    <div className="flex items-center mb-4">
                        <AiOutlineArrowLeft className="text-lg mr-2 cursor-pointer" />
                        <h1 className="text-xl font-semibold" onClick={handleBackClick}>Shipping Details</h1>
                    </div>
                    <form className="space-y-4 bg-white p-6 rounded-lg shadow-md">
                        <div>
                            {/* <label className="block text-sm font-medium">Name</label> */}
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Full Name"
                            />
                        </div>
                        <div>
                            {/* <label className="block text-sm font-medium">Mobile Number</label> */}
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Mobile No"
                            />
                        </div>
                        <div>
                            {/* <label className="block text-sm font-medium">Email</label> */}
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            {/* <label className="block text-sm font-medium">Address Line 1</label> */}
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Flat, House no, Building"
                            />
                        </div>
                        <div>
                            {/* <label className="block text-sm font-medium">Landmark (Optional)</label> */}
                            <input
                                type="text"
                                name="landmark"
                                value={formData.landmark}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Landmark, Additional info"
                            />
                        </div>
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                {/* <label className="block text-sm font-medium">Pincode</label> */}
                                <input
                                    type="text"
                                    name="pinCode"
                                    value={formData.pinCode}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Pincode"
                                />
                            </div>
                            <div className="flex-1">
                                {/* <label className="block text-sm font-medium">City</label> */}
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="City"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                {/* <label className="block text-sm font-medium">State</label> */}
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="State"
                                />
                            </div>
                            <div className="flex-1">
                                {/* <label className="block text-sm font-medium">Country</label> */}
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Country"
                                />
                            </div>
                        </div>
                        <div>
                            {/* <label className="block text-sm font-medium">Tag</label> */}
                            <div className="flex space-x-2 mt-1">
                                <button
                                    type="button"
                                    name="tag"
                                    value="Home"
                                    onClick={() => handleTagChange('Home')}
                                    className={`px-4 py-2 rounded-md ${formData.tag === 'Home' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                                >
                                    Home
                                </button>
                                <button
                                    type="button"
                                    name="tag"
                                    value="Work"
                                    onClick={() => handleTagChange('Work')}
                                    className={`px-4 py-2 rounded-md ${formData.tag === 'Work' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                                >
                                    Work
                                </button>
                                <button
                                    type="button"
                                    name="tag"
                                    value="Others"
                                    onClick={() => handleTagChange('Others')}
                                    className={`px-4 py-2 rounded-md ${formData.tag === 'Others' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                                >
                                    Others
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="w-full md:w-1/3 mt-8 md:mt-0 md:ml-8">
                    <div className="bg-green-50 p-6 rounded-lg shadow-md">
                        <div className="flex items-center mb-4">
                            <div className="relative">
                                <AiOutlineShoppingCart className="text-lg mr-2" />
                                {count && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                        {count}
                                    </span>
                                )}
                            </div>
                            <div className='ml-6'>
                                <div className="text-xl font-semibold">₹ {amount}.00</div>
                                <div className="text-sm text-gray-500">(incl. of all taxes)</div>
                            </div>
                        </div>
                        <h2 className="text-lg font-semibold border-b pb-2">Total price</h2>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li className="flex justify-between">
                                <span>Distributor price discount</span>
                                <span className="text-green-500">- ₹ 00.00</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Delivery charges</span>
                                {amount > 1000 ? <span className="text-green-500">Free </span> : <span className="text-black">₹ {shipcost}</span>}
                            </li>
                            <li className="flex justify-between">
                                <span>Rounding Item amount</span>
                                <span className="text-green-500">₹ 0.00</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Price before taxes</span>
                                <span>₹ {(amount - gst).toFixed(2)}</span>
                            </li>
                            <li className="flex justify-between border-b pb-1">
                                <span>Taxes</span>
                                <span>₹ {gst.toFixed(2)}</span>
                            </li>
                        </ul>
                        <div className="flex justify-between mt-4 font-semibold text-lg">
                            <span>Total</span>
                            <span>₹ {amount + shipcost}.00</span>
                        </div>
                        <button onClick={handlePayment} className={`w-full mt-4 py-2 rounded-md ${isFormValid() ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`} disabled={!isFormValid()}>PROCEED TO PAY</button>
                    </div>
                    <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                        <p><strong>Stay Vigilant Stay Safe.</strong> The total payment made by you as shown above in the order summary is inclusive of the delivery charges.</p>
                    </div>
                </div>
            </div>
        </>
    );
};


const Page: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentPage />
        </Suspense>
    );
};

export default Page;
