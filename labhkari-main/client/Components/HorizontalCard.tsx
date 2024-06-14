import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';

interface CardProps {
    title: string;
    image: string | StaticImport;
    price: number;
    customId: number;
    userId: string;
    count: number;
    weight: number;
    gst: string;
}

const HorizontalCard: React.FC<CardProps> = ({ title, image, price, customId, userId, count, weight, gst }) => {
    const [quantity, setQuantity] = useState(count);

    const base64Image = Buffer.from(image as string).toString('base64');

    const updateQuantity = async (newQuantity: React.SetStateAction<number>) => {
        const url = process.env.NEXT_PUBLIC_SERVER_URL + "/cart/add";
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ customId: customId, userId: userId, count: newQuantity, price: price, image: image, weight: weight, gst: gst }),
            });
            const res = await response.json();
            setQuantity(res.count);
        } catch (e) {
            console.log("error ", e)
        }
    };

    const incrementOrDecrementQuantity = (amount: number) => {
        const newQuantity = amount;
        updateQuantity(newQuantity);
    };

    const handleDelete = async (customId: number) => {
        const url = process.env.NEXT_PUBLIC_SERVER_URL + "/cart/delete";
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid: userId, customId: customId }),
            });
            const res = await response.json();
            console.log(res)
        } catch (e) {
            console.log("error ", e)
        }
    }


    return (
        <div className="flex items-center border-b border-black py-2 ml-1">
            <Image src={image} alt={title} className="w-20 h-20 object-cover rounded-md mr-2" width={50} height={50} />
            <div className="flex-grow">
                <Link href={{ pathname: '/product', query: { customId: customId } }}>
                    <h3 className="text-lg text-black font-semibold">{title}</h3>
                </Link>
                <p className="text-black">₹ {price}</p>
            </div>
            <div className="flex items-center mr-0">
                <button onClick={() => incrementOrDecrementQuantity(-1)} className="px-3 py-1 bg-white rounded-l-md">
                    -
                </button>
                <span className="px-3 py-1 bg-white text-black">{quantity}</span>
                <button onClick={() => incrementOrDecrementQuantity(1)} className="px-3 py-1 bg-white rounded-r-md">
                    +
                </button>
                <button onClick={() => handleDelete(customId)} className="ml-2 text-[#103178] focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M13.414 10l3.293 3.293a1 1 0 0 1-1.414 1.414L12 11.414l-3.293 3.293a1 1 0 1 1-1.414-1.414L10.586 10 7.293 6.707a1 1 0 0 1 1.414-1.414L12 8.586l3.293-3.293a1 1 0 0 1 1.414 1.414L13.414 10z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default HorizontalCard;
