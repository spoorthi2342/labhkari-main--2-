'use client'
import React, { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Navbar from '@/Components/Navbar';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Item {
    description: string;
    customId: number;
    title: string;
    count: number;
    userId: string;
    image: string;
    price: number;
    ratings: number;
    tag: string;
    path: string;
    gst: string;
    shipc: string;
    weight: string;
}

const PageContent: React.FC = () => {
    const searchParams = useSearchParams();
    const id = searchParams ? searchParams.get('customId') : null;
    const ref = searchParams ? searchParams.get('ref') : null;
    const [data, setData] = useState<Item[]>([]);
    const [image, setImage] = useState('');
    const [buffer, setBuffer] = useState();

    useEffect(() => {
        const handleCart = async () => {
            const url = process.env.NEXT_PUBLIC_SERVER_URL + "/product/getid";
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ customId: id }),
                });
                const res = await response.json();
                setData(res.data);
            } catch (error) {
                console.error('Error:', error);
            }
        }
        id && handleCart();
    }, [id]);

    const [pincode, setPincode] = useState<string>('');
    const [isPincodeValid, setIsPincodeValid] = useState<boolean>(false);

    const handlePincodeCheck = () => {
        // Add logic to check pincode validity (e.g., API call)
        setIsPincodeValid(true); // Set to true for demonstration
    };

    const handleAddToCart = async (event: any, title: string, image: string, price: number, gst: string, weight: string) => {
        event.preventDefault();
        let uid = localStorage.getItem('userId');

        if (uid === null) {
            uid = '12345';
            localStorage.setItem('userId', uid);
        } else if (uid !== '12345') {
            uid = localStorage.getItem('userId');
        }

        const url = process.env.NEXT_PUBLIC_SERVER_URL + "/cart/add";
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ customId: id, userId: uid, count: 1, title: title, image: image, price: price, ref: ref ? ref : '', gst: gst, weight: weight }),
            });
            const res = await response.json();
            if (res.success) {
                alert("Added to Cart successfully")
            } else {
                alert('Failed to add to Cart')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleBuyNow = () => {
        // Add logic to proceed to checkout
        console.log('Proceeding to checkout with product:');
    };

    return (
        <>
            <Navbar onSearch={() => { }} />
            {
                data.length > 0 && <div className="py-8 md:mt-24 mt-28">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row -mx-4">
                            <div className="md:flex-1 px-4">
                                <div className="md:h-auto rounded-lg bg-gray-300 dark:bg-black mb-4">
                                    <Image className="w-full rounded-lg shadow-lg" width={500} height={500} src={data[0].image} alt="Product Image" />
                                </div>
                                <div className="flex -mx-2 ">
                                    <div className="w-full px-2">
                                        <button className="w-full dark:bg-[#103178] text-white md:py-2 py-3 px-4 rounded-full font-bold hover:bg-[#103178]" onClick={(e) => handleAddToCart(e, data[0].title, data[0].image, data[0].price, data[0].gst, data[0].weight)}>Add to Cart</button>
                                    </div>
                                </div>
                            </div>
                            <div className="md:flex-1 px-4 mt-3">
                                <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                                    <h2 className="text-2xl font-bold text-black dark:text-black mb-2">{data[0].title}</h2>
                                </div>
                                <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                                    <div className="flex flex-col md:flex-row mb-4">
                                        <div className="flex items-center mb-2 md:mb-0 md:mr-8">
                                            <span className='font-bold text-gray-700 dark:text-black mr-2'>Rating :</span>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span key={star}>
                                                    {star <= data[0].ratings ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4 text-yellow-400"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10 0l2.42 6.06L18 7.24l-5.2 4.5 1.55 6.65L10 15.4 5.65 18.4l1.55-6.65L2 7.24 7.58 6.06 10 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4 text-gray-400"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10 0l2.42 6.06L18 7.24l-5.2 4.5 1.55 6.65L10 15.4 5.65 18.4l1.55-6.65L2 7.24 7.58 6.06 10 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    )}
                                                </span>
                                            ))}
                                        </div>
                                        <div>
                                            <span className="font-bold text-gray-700 dark:text-black mr-2">Availability :</span>
                                            {data[0].tag === "IN" ? <span className="text-green-900">Available</span> : <span className="text-red-900">Unavailable</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                                    <span className="font-bold text-gray-700 dark:text-black">Product Description:</span>
                                    <p className="text-black dark:text-black text-sm mt-2">
                                        {data[0].description}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                                    <div className="flex flex-row items-center mt-12">
                                        <div className="flex-1 mb-4 md:mb-0">
                                            <span className="text-2xl leading-none align-baseline">₹ </span>
                                            <span className="font-bold text-5xl leading-none align-baseline">{data[0].price}</span>
                                            <span className="text-2xl leading-none align-baseline">.00</span>
                                        </div>
                                        <div className="flex-1 md:ml-8">
                                            <button className="bg-yellow-300 opacity-75 hover:opacity-100 text-yellow-900 hover:text-gray-900 rounded-full px-10 py-2 font-semibold">
                                                <i className="mdi mdi-cart -ml-2"></i>
                                                <Link href={{ pathname: '/payment', query: { amount: data[0].price, count: 1, gst: Math.round(data[0].price - (data[0].price / (1 + ((parseFloat(data[0]?.gst) || 0) / 100)))), shipc: ((parseFloat(data[0]?.weight) || 0) / 1000 * 60) } }}>BUY NOW</Link>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
                                    <div className="flex items-center mt-3 mb-0">
                                        <input
                                            type="text"
                                            placeholder="Enter Pincode"
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value)}
                                            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-2 py-2"
                                        />
                                        <button
                                            className="bg-[#103178] hover:bg-[#103178] md:ml-4 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                            onClick={handlePincodeCheck}
                                        >
                                            Check
                                        </button>
                                    </div>
                                    {isPincodeValid && (
                                        <div className="text-green-600 mb-4">Delivery available to this pincode!</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            }
        </>
    );
};

const Page: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PageContent />
        </Suspense>
    );
};

export default Page;
