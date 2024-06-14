'use client'
import Image from 'next/image';
import { act, useEffect, useState } from 'react';
import HorizontalCard from '@/Components/HorizontalCard';
import Link from 'next/link';
import Navbar from '@/Components/Navbar';

interface Item {
    customId: number;
    title: string;
    count: number;
    userId: string;
    image: string;
    price: number;
    weight: number;
    gst: string;
}

const Page = () => {
    const [arr, setArr] = useState<Item[]>([]);
    const [done, setDone] = useState<boolean>(false);
    const [count, setCount] = useState(0);
    const [cartAmount, setCartAmount] = useState(0);
    const [gst, setGst] = useState(0);
    const [shipCost, setShipCost] = useState(0);
    const [actCost, setActCost] = useState(0);

    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_SERVER_URL + "/cart/fetch";
        const uid = localStorage.getItem('userId');
        const handleCart = async () => {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ uid: uid }),
                });
                const res = await response.json();
                const totals = res.data.reduce((acc: { totalCount: number, totalShipCost: number, totalGst: number, totalActualCost: number }, item: { price: number, count: number, gst: string, weight: string }) => {
                    const weightInGrams = parseFloat(item.weight);
                    const weightInKg = isNaN(weightInGrams) ? 0 : weightInGrams / 1000;
                    const shipCost = weightInKg * 60;
                    const gstPercentMatch = item.gst;
                    const gstPercent = gstPercentMatch ? parseFloat(gstPercentMatch) : 0;
                    const price = parseFloat(item.price.toString());  // Ensure price is a number
                    const priceExcludingGST = price / (1 + (gstPercent / 100));
                    const gstAmount = price - priceExcludingGST;
                    const itemTotalExcludingGST = priceExcludingGST * item.count;
                    const itemTotalGST = gstAmount * item.count;
                    const itemTotalShipCost = shipCost * item.count;
                    const itemTotal = itemTotalExcludingGST + itemTotalGST + itemTotalShipCost;
                    acc.totalCount += itemTotal;
                    acc.totalShipCost += itemTotalShipCost;
                    acc.totalGst += itemTotalGST;
                    acc.totalActualCost += itemTotalExcludingGST;
                    return acc;
                }, { totalCount: 0, totalShipCost: 0, totalGst: 0, totalActualCost: 0 });

                setActCost(totals.totalActualCost)
                setGst(totals.totalGst)
                setShipCost(totals.totalShipCost);
                setCartAmount(totals.totalCount)
                setArr(res.data)
                setDone(true)
                setCount(res.data.length)
            } catch (error) {
                console.error('Error:', error);
            }
        }
        uid && handleCart();
    });


    return (
        <>
            <Navbar onSearch={() => { }} />
            <div className="container mx-auto p-4 md:mt-28 mt-36">
                {count === 0 ? (
                    <div className="text-center flex flex-col items-center">
                        <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
                        <p>There are no items in your cart. Would you like to explore some products?</p>
                        <div className="my-4">
                            <Image src="https://cdn.iconscout.com/icon/premium/png-256-thumb/empty-cart-2685174-2232751.png" alt="Empty Cart" width={200} height={200} />
                        </div>
                        <Link href="/">
                            <span className="inline-block bg-black text-white py-2 px-4 rounded">SHOP NOW</span>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row justify-between">
                        <div className="w-full lg:w-2/3 mb-20 lg:mb-0">
                            <div className="border p-4 rounded-md shadow-md mb-4">
                                <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
                                <p>Total Items: {count}</p>
                                {cartAmount > 1000 ? (
                                    <p className="text-green-500">✓ FREE Delivery</p>
                                ) : (
                                    <p className="text-green-500">Add products worth ₹{(1000 - cartAmount).toFixed(2)} to avail free delivery</p>
                                )}
                            </div>
                            {done && arr.map((i) => (
                                <HorizontalCard key={i.customId} title={i.title} customId={i.customId} gst={i.gst} count={i.count} userId={i.userId} image={i.image} price={i.price} weight={i.weight} />
                            ))}
                        </div>
                        <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-4 relative">
                            <div className="border p-4 rounded-lg shadow-md mb-4 bg-green-100">
                                <div className="flex justify-between items-baseline mb-4">
                                    <h3 className="text-xl font-semibold">You Pay</h3>
                                    <p className="text-2xl font-bold">₹{cartAmount.toFixed(2)}</p>
                                </div>
                                <div className='flex justify-between'>
                                    <p className="text-green-500 underline">View Our Order Policy</p>
                                    <span className="text-lg font-normal">(incl. of all taxes)</span>
                                </div>
                                <div className="w-full shadow-md mt-4 mb-4 p-2 bg-green-500 text-white rounded">
                                    <p className="text-lg">✓ You saved ₹ 0.00 on this order</p>
                                </div>
                                <button className="hidden lg:block w-full bg-black text-white py-2 rounded"><Link href={{ pathname: '/payment', query: { amount: (cartAmount - shipCost), count: count, gst: Math.round(gst), shipc: shipCost } }}>CHECKOUT</Link></button>
                            </div>
                            <div className="mt-4 border p-4 rounded-lg shadow-md mb-4">
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" />
                                    <span>I would like to voluntarily contribute Rs.10/-</span>
                                </label>
                            </div>
                            <div className="border p-4 rounded-lg shadow-md">
                                <div className="border-t mt-4 pt-4">
                                    <div className="flex justify-between border-b py-1">
                                        <p>Total price MRP</p>
                                        <p>₹{cartAmount.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between border-b py-1">
                                        <p>Distributor price discount</p>
                                        <p>- ₹ 0.00</p>
                                    </div>
                                    <div className="flex justify-between border-b py-1">
                                        <p>Delivery charges</p>
                                        {cartAmount > 1000 ? <p className="text-green-500">Free</p> : <p>₹ {shipCost}</p>}
                                    </div>
                                    <div className="flex justify-between border-b py-1">
                                        <p>Rounding Item amount</p>
                                        <p>- ₹0.00</p>
                                    </div>
                                    <div className="flex justify-between border-b py-1">
                                        <p>Price before taxes</p>
                                        <p>₹{actCost.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between border-b py-1">
                                        <p>Taxes</p>
                                        <p>₹ {gst.toFixed(2)}</p>
                                    </div>
                                </div>
                                <button className="w-full bg-gray-500 text-white py-2 mt-4 rounded mb-10">CONTINUE SHOPPING</button>
                            </div>
                            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white p-4 shadow-lg lg:hidden">
                                <button className="w-full bg-black text-white py-2 rounded"><Link href={{ pathname: '/payment', query: { amount: (cartAmount - shipCost), count: count, gst: Math.round(gst), shipc: shipCost } }}>CHECKOUT</Link>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Page;
