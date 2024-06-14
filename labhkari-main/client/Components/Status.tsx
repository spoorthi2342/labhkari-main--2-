'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import shoe from '../assets/shoe.jpeg';

const Status = () => {
    const [isUnread, setIsUnread] = useState(true);
    const [isClicked, setIsClicked] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [borderColor, setBorderColor] = useState(''); // Default border color
    const [isSpinning, setIsSpinning] = useState(false); // State to control spinning animation

    const handleClick = () => {
        setIsClicked(true);
    };

    const handleClose = () => {
        setIsClicked(false);
        setIsPopupOpen(false);
        setIsUnread(false);
        setBorderColor('border-gray-400 border-4'); // Change border color to gray
        setIsSpinning(false); // Stop spinning animation
    };

    useEffect(() => {
        if (isClicked) {
            setIsSpinning(true);
            setTimeout(() => {
                setIsPopupOpen(true);
                setIsClicked(false);
                setIsSpinning(false); // Stop spinning after timeout
            }, 1000); // Duration of rotation animation
        }
    }, [isClicked]);

    return (
        <div className="relative flex flex-col items-center justify-center">
            <div className="relative w-24 h-24">
                <div
                    className={`absolute inset-0 w-full h-full rounded-full ${borderColor} ${isUnread && !isClicked ? 'border-4 border-green-400' : ''} ${isSpinning ? 'animate-spin border-t-4 border-green-700' : ''}`}
                ></div>
                <button
                    onClick={handleClick}
                    className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center"
                >
                    <Image
                        src={shoe}
                        alt="Status Indicator"
                        className="w-20 h-20 object-cover rounded-full" // Decreased size of image
                    />
                </button>
            </div>
            {isPopupOpen && (
                <div className="fixed inset-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="relative max-w-lg w-full bg-white p-4 rounded-lg">
                        <button
                            onClick={handleClose}
                            className="absolute top-0 right-0 m-4 p-2 rounded-full bg-white text-black"
                        >
                            X
                        </button>
                        <Image
                            src={shoe}
                            alt="Popup Image"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Status;
