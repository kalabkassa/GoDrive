require('dotenv').config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// --- Routes ---

// Vehicles listing page
app.get('/vehicles', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vehicles.html'));
});

// Booking page for each vehicle (you handle ID in frontend JS)
const allowedCars = ['yaris', 'dezire', 'glory', 'highroof', 'toyota'];

app.get('/vehicles/:id', (req, res) => {
    const carId = req.params.id.toLowerCase();

    if (allowedCars.includes(carId)) {
        res.sendFile(path.join(__dirname, 'public', `booking-${carId}.html`));
    } else {
        res.status(404).send('Vehicle not found');
    }
});

// Thank you page after booking
app.get('/thankyou', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'thankyou.html'));
});

// Email endpoint
app.post("/send-email", async (req, res) => {
    const { name, email, phone, car, pickupDate, pickupTime, returnDate, returnTime } = req.body;

    try {
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        await transporter.sendMail({
            from: `"Go Drive Website" <${process.env.SMTP_USER}>`,
            to: process.env.RECEIVER_EMAIL,
            subject: `🚗 New Booking: ${name} | ${pickupDate} – ${returnDate}`,
            text: `New car booking received:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCar: ${car}\nPickup: ${pickupDate} at ${pickupTime}\nReturn: ${returnDate} at ${returnTime}`,
            html: `<h2>New Car Booking Received</h2>
            <p><b>Name:</b> ${name}</p>
            <p><b>Email:</b> <a href="mailto:${email}">${email}</a></p>
            <p><b>Phone:</b> ${phone}</p>
            <p><b>Car:</b> ${car}</p>
            <p><b>Pickup:</b> ${pickupDate} at ${pickupTime}</p>
            <p><b>Return:</b> ${returnDate} at ${returnTime}</p>
            <hr />
            <p style="font-size: 0.9em; color: #888;">This is an automated booking notification sent from the Go Drive website.</p>`
        });

        await transporter.sendMail({
            from: `"Go Drive" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `✅ Booking Confirmed – ${car} from ${pickupDate} | Go Drive`,
            text: `Hi ${name},\n\nThanks for booking with Go Drive!\n\nHere are your booking details:\nCar: ${car}\nPickup: ${pickupDate} at ${pickupTime}\nReturn: ${returnDate} at ${returnTime}\nPhone: ${phone}\nEmail: ${email}\n\nIf you have any questions or need to make changes, feel free to contact us.\n\nSafe travels,\nThe Go Drive Team`,
            html: `<p>Hi ${name},</p>
            <p>Thank you for choosing <strong>Go Drive</strong>! Your booking has been successfully received. Below are your booking details:</p>
            <table cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
            <tr><td><strong>Car:</strong></td><td>${car}</td></tr>
            <tr><td><strong>Pickup:</strong></td><td>${pickupDate} at ${pickupTime}</td></tr>
            <tr><td><strong>Return:</strong></td><td>${returnDate} at ${returnTime}</td></tr>
            <tr><td><strong>Phone:</strong></td><td>${phone}</td></tr>
            <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
            </table>
            <p>If you need to make any changes or have questions, just reply to this email or contact us directly.</p>
            <p>Safe travels!<br />— The <strong>Go Drive</strong> Team</p>`
        });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Newsletter email endpoint
app.post('/newsletter', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    try {
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        await transporter.sendMail({
            from: `"Newsletter" <${process.env.SMTP_USER}>`,
            to: process.env.RECEIVER_EMAIL, // Your receiving email
            subject: "New Newsletter Subscription",
            html: `<p>New subscription from: <b>${email}</b></p>`,
        });

        res.json({ success: true, message: 'Subscription email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

//app.listen(port, () => {
//    console.log("✅ Server running at http://localhost:3000");
//});
module.exports = app;
