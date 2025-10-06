require('dotenv').config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

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
            from: `"Website Contact" <${process.env.SMTP_USER}>`,
            to: process.env.RECEIVER_EMAIL,
            subject: `Message from ${name}`,
            text: `
                Name: ${name}
                Email: ${email}
                Phone: ${phone}
                Car: ${car}
                Pickup Date: ${pickupDate} at ${pickupTime}
                Return Date: ${returnDate} at ${returnTime}`,
            html: `
                <p><b>From:</b> ${name} (${email})</p>
                <p><b>Phone:</b> ${phone}</p>
                <p><b>Car:</b> ${car}</p>
                <p><b>Pickup Date & Time:</b> ${pickupDate} at ${pickupTime}</p>
                <p><b>Return Date & Time:</b> ${returnDate} at ${returnTime}</p>`
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

app.listen(port, () => {
    console.log("✅ Server running at http://localhost:3000");
});

