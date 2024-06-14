import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { AiOutlineShareAlt, AiOutlineShoppingCart } from 'react-icons/ai';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';

interface CardProps {
    customId: number;
    title: string;
    image: string | StaticImport;
    description: string;
    price: number;
    rating: number;
    tag: string;
    path: string;
    gst: string;
    weight: string;
}

const Card: React.FC<CardProps> = ({ customId, title, image, description, price, rating, tag, path, gst, weight }) => {
    const searchParams = useSearchParams();
    const ref = searchParams ? searchParams.get('ref') : null;

    const handleAddToCart = async (event: any) => {
        const url = process.env.NEXT_PUBLIC_SERVER_URL + "/cart/add";
        event.preventDefault();
        let uid = localStorage.getItem('userId');

        if (uid === null) {
            uid = '12345';
            localStorage.setItem('userId', uid);
        } else if (uid !== '12345') {
            uid = localStorage.getItem('userId');
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ customId: customId, userId: uid, count: 1, title: title, price: price, ref: ref ? ref : '', image: image, gst: gst, weight: weight }),
            });
            const res = await response.json();
            if (res.success) {
                alert("Added to Cart successfully")
            } else {
                alert('Failed to add to Cart')
                console.log(res);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function shareOnWhatsApp(id: number) {
        const message = `http://localhost:3000/product?id=${id}&ref=${localStorage.getItem('userId')}`;
        const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, '_blank');
    }

    return (
        <div className="max-w-md w-full bg-gray-100 shadow-lg rounded-xl overflow-hidden relative">
            <div className="relative" style={{ marginTop: "-1rem" }}>
                <Link href={{ pathname: '/product', query: { customId: customId } }}>
                    <div className="w-full h-[500px] relative">
                        <Image
                            src={image}
                            alt={title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-t-xl"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <p className="text-lg font-semibold">{title}</p>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="p-4">
                {/* Title */}
                <div className="text-2xl font-bold mb-2">{title}</div>

                {/* Price, Rating, Stock Status */}
                <div className="flex items-center justify-between mb-4">
                    <div className="text-xl font-semibold text-gray-700">₹ {price}</div>
                    {/* <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star}>
                                {star <= rating ? (
                                    <FaStar className="text-yellow-400" />
                                ) : star - rating === 0.5 ? (
                                    <FaStarHalfAlt className="text-yellow-400" />
                                ) : (
                                    <FaRegStar className="text-gray-400" />
                                )}
                            </span>
                        ))}
                    </div> */}
                    <div className={`text-sm font-semibold ${tag === "IN" ? "text-green-500" : "text-red-500"}`}>
                        {tag === "IN" ? "In Stock" : "Out of Stock"}
                    </div>
                </div>

                {/* Share and Add to Cart Buttons */}
                <div className="flex items-center justify-between mt-4">
                    <button
                        onClick={() => shareOnWhatsApp(customId)}
                        className="flex items-center text-[#103178] hover:text-white bg-white hover:bg-[#103178] transition duration-300 border border-[#103178] px-3 py-1 rounded-full shadow-md"
                    >
                        <AiOutlineShareAlt className="w-5 h-5 mr-1" />
                        <span className="inline font-semibold">Share</span>
                    </button>
                    <button
                        onClick={handleAddToCart}
                        className="flex items-center text-white bg-[#103178] hover:bg-[#103178] transition duration-300 px-3 py-1 rounded-full shadow-md"
                    >
                        <AiOutlineShoppingCart className="w-5 h-5 mr-1" />
                        <span className="inline font-semibold">Add to Cart</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Card;
