import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import nodemailer from 'nodemailer';

const sendMail = async (to: string, subject: string, trackingUrl: string, status: string, name: string) => {
    try {
        const htmlContent = `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Your order Confirmed</title>
        </head>
        <body>
            <h1>Track your order now</h1>
            <p>Current Status: ${status}</p> 
            <br/><br/>
            <div>Tracker: <a href="${trackingUrl}">${trackingUrl}</a></div>
            <p>Thank you, ${name}</p>
            <img src="https://i.postimg.cc/YqpVfbHN/playstore2.png" width="90" height="40">
        </body>
        </html>`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: "wear.from.brand@gmail.com",
                pass: "xdfz zzgj bmhr dtxq",
            },
            connectionTimeout: 5 * 60 * 1000, // 5 min
        });

        const info = await transporter.sendMail({
            from: "wear.from.brand@gmail.com",
            to,
            subject,
            html: htmlContent,
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error(error);
    }
};

const handleShip = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { order_id } = req.body;
        const url = process.env.NEXT_PUBLIC_SERVER_URL + "/order/fetchOrder";
        try {
            // Fetch order details from your Orders API
            const orderResponse = await axios.post('http://localhost:4000/order/fetchOrder', {
                "order_id": order_id
            });
            const order = orderResponse.data;
            // Check if order exists
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            // Fetch shipment details from Shipway
            const shipmentResponse = await axios.post('https://shipway.in/api/getOrderShipmentDetails', {
                "username": "karhtikshetty1@gmail.com",
                "password": "84b0beb51d36f306bd5999249134e792",
                "order_id": order_id
            });


            const { tracking_url, current_status } = shipmentResponse.data.response;
            console.log(shipmentResponse);
            // Send email with shipment details
            await sendMail(order.data[0].email, "Your Order Shipment Details", tracking_url, current_status, order.data[0].name);

            res.status(200).json({ message: 'Shipment details fetched and email sent successfully' });
        } catch (error) {
            console.error('Error after successful payment:', error);
            res.status(500).json({ error: 'Failed to fetch shipment details or send email' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

export default handleShip;
