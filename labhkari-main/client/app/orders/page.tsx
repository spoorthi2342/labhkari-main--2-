'use client'
import Navbar from '@/Components/Navbar';
import Orders from '@/Components/Orders';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Order {
    orderId: string;
    tracking_url: string;
    customer_name: string;
    current_status: string;
}

const Page: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderDetails, setOrderDetails] = useState<{ shipmentDetails: Order }[]>([]);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const fetchOrdersAndDetails = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setLoggedIn(false);
                return;
            }
            setLoggedIn(true);

            try {
                // First API call to get orders based on userId
                const url = process.env.NEXT_PUBLIC_SERVER_URL + "/order/userID";
                const res = await axios.post<{ data: Order[] }>(url, { userId });
                const ordersData = res.data.data;

                // Array of promises for the second API call to get shipment details for each order
                const detailsPromises = ordersData.map(async (order) => {
                    const detailRes = await axios.post<{ response: Order }>('https://shipway.in/api/getOrderShipmentDetails', {
                        username: "karhtikshetty1@gmail.com",
                        password: "84b0beb51d36f306bd5999249134e792",
                        order_id: order.orderId
                    });
                    // Return a new object that combines the order data and the shipment details
                    return { shipmentDetails: detailRes.data.response };
                });

                // Wait for all promises to resolve
                const details = await Promise.all(detailsPromises);

                // Update the state with the combined data
                setOrderDetails(details);
            } catch (e) {
                console.error(e);
            }
        };
        fetchOrdersAndDetails();
    }, []);

    return (
        <>
            <Navbar onSearch={() => { }} />
            {!loggedIn && (
                <div className="flex justify-center items-center h-screen">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Please login to get your order details</h2>
                    </div>
                </div>
            )}
            {loggedIn && (
                <div className='mt-36 md:mt-0 mb-12 md:mb-0'>
                    {orderDetails.map((orderDetail) => (
                        <Orders
                            key={orderDetail.shipmentDetails.orderId}
                            orderId={orderDetail.shipmentDetails.orderId}
                            tracking_url={orderDetail.shipmentDetails.tracking_url}
                            name={orderDetail.shipmentDetails.customer_name}
                            current_status={orderDetail.shipmentDetails.current_status}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default Page;
