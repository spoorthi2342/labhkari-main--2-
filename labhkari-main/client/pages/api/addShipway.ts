import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

interface SendShipRequest extends NextApiRequest {
    body: {
        orderId: string;
        email: string;
        phone: string;
        name: string;
        amount: number;
        amountPaid: boolean;
        userId: string | null;
        paymentMethod: string;
        itemCount: number;
        shippingAddress: string;
        state: string;
        country: string;
        landmark: string;
        city: string;
        tag: string;
        pinCode: number;
    };
}

const handleShip = async (req: SendShipRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        try {
            const { orderId, email, phone, name, amount, amountPaid, userId, itemCount, shippingAddress, state, country, landmark, city, tag, pinCode } = req.body;
            // Add the order details to your order table
            const orderApiUrl = process.env.NEXT_PUBLIC_SERVER_URL + "/order/addOrder";
            await axios.post(orderApiUrl, {
                orderId,
                email,
                amount,
                name,
                phone,
                amountPaid,
                userId,
                itemCount,
                shippingAddress,
                state,
                country,
                landmark,
                city,
                tag,
                pinCode
            });

            // Add shipment details to Shipway
            const shipwayResponse = await axios.post('https://shipway.in/api/PushOrderData', {
                "username": "karhtikshetty1@gmail.com",
                "password": "84b0beb51d36f306bd5999249134e792",
                "carrier_id": "1",
                "awb": '1122334455', // Replace with actual AWB if needed
                "order_id": orderId,
                "first_name": name,
                "last_name": 'Customer',
                "email": email,
                "phone": phone,
                "products": 'N/A',
                "company": 'Shipway',
                "shipment_type": '1'
            });

            console.log('Shipway response:', shipwayResponse.data.response);
            res.status(200).json({ message: 'Order and shipment details added successfully' });
        } catch (error) {
            console.error('Error after successful payment:', error);
            res.status(500).json({ error: 'Failed to add order or shipment details' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

export default handleShip;
