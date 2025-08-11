# Node.js Email Server

A simple Node.js server using Express and Nodemailer to send emails from a contact form.

## Prerequisites

- Node.js installed (v14 or later recommended)
- SMTP email account credentials (e.g., Gmail SMTP, Outlook SMTP, or other email provider)

## Installation & Setup

1. Clone this repository and navigate into it:

   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo

2. Create a .env file to setup email
     eg.
   ```config
         SMTP_HOST=smtp.example.com
         SMTP_PORT=465
         SMTP_USER=your@email.com
         SMTP_PASS=yourpassword
         RECEIVER_EMAIL=someone@example.com

4. run the server with
    npm start
