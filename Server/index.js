import express from 'express';
import mongoose from 'mongoose';
import { clerkMiddleware } from '@clerk/express'
import dotenv from 'dotenv';
import cors from 'cors';
import clerkWebhooks from './controller/clerkWebhiiks.js';
import userRouter from './router/userRoutes.js';
import hotelRouter from './router/hotelRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import roomRouter from './router/roomRoutes.js';
import bookingRouter from './router/bookingRoutes.js';
import { stripeWebhooks } from './controller/stripeWebhooks.js';


dotenv.config();

const app = express();
const port = 5000;

// Middleware ......................
app.use(cors())
app.post(
  '/api/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhooks
);

app.use(express.json())
app.use(clerkMiddleware())

// Api listen to Clerk WebHook 

app.use('/api/clerk', clerkWebhooks)

// MongoDB URI
const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1j9mur9.mongodb.net/${process.env.DB_NAME}`;

mongoose.connect(URI)
  .then(() => console.log("✅ Database Connected"))
  .catch((err) => console.error("❌ Database Error:", err));
connectCloudinary()

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api/user',userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)



app.listen(port, () => {
  console.log(`🚀 Example app listening on port http://localhost:${port}`);
});
