# GroceryPoint Backend

This is the backend for the GroceryPoint e-commerce app, built with Node.js, Express, and MongoDB.

## Requirements
- Node.js (v16+ recommended)
- MongoDB database (connection string in `.env`)

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create a `.env` file** in the backend folder:
   ```env
   MONGODB_URL=mongodb+srv://vsah758:OKf6c5uumBpyMjmv@cluster0.synke2i.mongodb.net/Grocerry?retryWrites=true&w=majority
   JWT_SECRET=supersecretkey
   PORT=5000
   ```

3. **Start the backend server:**
   - For production:
     ```bash
     npm start
     ```
   - For development (auto-restart on changes):
     ```bash
     npm run dev
     ```

4. **API Endpoints:**
   - Auth: `/api/auth` (register, login)
   - Products: `/api/products`
   - Cart: `/api/cart`
   - Wishlist: `/api/wishlist`
   - (More endpoints: orders, addresses, admin, etc.)

5. **Frontend Integration:**
   - Make sure your frontend (React) app uses the correct backend API URL, e.g. `http://localhost:5000/api`.
   - Enable CORS in backend (already done).

6. **Useful Scripts:**
   - `npm start` — run server
   - `npm run dev` — run server with nodemon (auto-reload)

---

For any issues, check your MongoDB connection and .env file values. 

MongoDB connected
Server running on port 5000 

const dotenv = require('dotenv');
dotenv.config(); 

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err)); 

GroceryPoint Backend API Running 