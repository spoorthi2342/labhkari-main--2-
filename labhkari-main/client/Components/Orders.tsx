'use client'
import Link from 'next/link';
import { FaTruck } from 'react-icons/fa';

interface OrderProps {
    orderId: string;
    tracking_url: string;
    name: string;
    current_status: string;
}


const Orders: React.FC<OrderProps> = ({ orderId, tracking_url, name, current_status }) => {

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 flex items-center justify-center">
            <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold">Order {orderId}</h1>
                    <Link href='${tracking_url}'>
                        <span className="text-blue-500 hover:underline mt-2 sm:mt-0">tracking url : {tracking_url} &rarr;</span>
                    </Link>
                </div>
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-6">
                    <div className="flex flex-col md:flex-row md:items-center">
                        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                            <img src="https://via.placeholder.com/150" alt="Nomad Tumbler" className="w-24 h-24 object-cover" />
                        </div>
                        <div className="flex-grow">
                            <h2 className="text-lg font-bold">{name}</h2>
                            <p className="text-gray-500">$35.00</p>
                            <p className="text-gray-700 mt-2">
                                This durable and portable insulated tumbler will keep your beverage at the perfect temperature during your next adventure.
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700">Delivery address</h3>
                            <p className="text-gray-700 mt-2">Floyd Miles</p>
                            <p className="text-gray-700">7363 Cynthia Pass</p>
                            <p className="text-gray-700">Toronto, ON N3Y 4H8</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700">Shipping updates</h3>
                            <p className="text-gray-700 mt-2">f•••@example.com</p>
                            <p className="text-gray-700">1••••••••40</p>
                            <Link href="/edit">
                                <span className="text-blue-500 hover:underline mt-2 block">Edit</span>
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            <h3 className="text-sm font-semibold text-gray-700">Order placed</h3>
                            <p className="text-gray-700 mt-2">March 22, 2021</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700">{current_status}</h3>
                    <div className="relative pt-4">
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                            <div style={{ width: '25%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-blue-500">Order placed</span>
                            <span>Processing</span>
                            <span>Shipped</span>
                            <span>Delivered</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;
