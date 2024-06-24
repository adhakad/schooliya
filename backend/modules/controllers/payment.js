'use strict';
const { KEY_ID, KEY_SECRET } = process.env;
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { DateTime } = require('luxon');
const nodemailer = require('nodemailer');
const Payment = require('../models/payment');
const tokenService = require('../services/admin-token');
const key_id = KEY_ID;
const key_secret = KEY_SECRET;

const razorpay = new Razorpay({
  key_id: key_id,
  key_secret: key_secret,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: `dhakaddeepak9340700360@gmail.com`,
    pass: 'cbgcwsgpajyhvztj'
  },
});


let CreatePayment = async (req, res) => {
  const { adminId, activePlan, amount, currency } = req.body;
  const paymentData = {
    amount: amount * 100,
    currency: currency,
  };
  try {
    const order = await razorpay.orders.create(paymentData);
    const payment = new Payment({
      adminId: adminId,
      activePlan: activePlan,
      orderId: order.id,
      amount: amount,
      currency,
    });
    await payment.save();
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ errorMsg: 'Payment creation failed !' });
  }
};

let ValidatePayment = async (req, res) => {
  try {
    const { payment_id: paymentId, order_id: orderId, signature, email, id } = req.body;
    const adminInfo = { id, email };
    const secretKey = 'TVIz565DG7GB1kzF4Q8uVayK';
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto.createHmac("sha256", secretKey).update(body).digest("hex");

    if (expectedSignature !== signature) {
      throw new Error('Invalid signature');
    }

    const updatedPayment = await Payment.findOneAndUpdate(
      { orderId },
      { status: 'success' },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(400).json({ errorMsg: 'Failed to update payment status !' });
    }
    sendEmail(email);
    const payload = { id, email };
    const accessToken = await tokenService.getAccessToken(payload);
    const refreshToken = await tokenService.getRefreshToken(payload);

    return res.status(200).json({ success: true, adminInfo, accessToken, refreshToken, successMsg: 'Payment successfully validated.' });
  } catch (error) {
    return res.status(500).json({ errorMsg: 'Error validating payment!' });
  }

}
async function sendEmail(email) {
  const mailOptions = {
    from: { name: 'Schooliya', address: 'dhakaddeepak9340700360@gmail.com' },
    to: email,
    subject: 'Schooliya Account Confirmation: Payment Received',
    html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <p style="color: #666;">Hello ${email}</p>
      <p style="color: #666;">Your payment is confirmed, and your account is now active with Schooliya! Dive right in and explore. For any assistance, reach out to us at support@schooliya.com .</p>
    </div>`
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    res.status(500).json({ errorMsg: 'Error sending email !' });
  }
}
module.exports = {
  CreatePayment,
  ValidatePayment
}