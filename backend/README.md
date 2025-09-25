# GrocerryPoint Backend

Node.js + Express + MongoDB backend for GrocerryPoint.

## Features
- User & Admin Authentication (JWT)
- Product Management (CRUD, categories, featured, stats)
- Cart & Wishlist (per-user)
- Orders & Order Tracking
- Address Book (per-user)
- Reviews (per-product)
- Contact/Support
- Newsletter Subscription
- Admin Dashboard Stats

## Project Structure
- `controllers/` - Business logic for each resource
- `models/` - Mongoose schemas
- `routes/` - Express route definitions
- `middlewares/` - Auth, error handling, etc.
- `config/` - DB and app config
- `seeder.js` - Seed script for demo data

## Getting Started
1. Copy `.env.example` to `.env` and fill in your config
2. Run `npm install`
3. Start MongoDB locally or use MongoDB Atlas
4. Run `npm run dev` to start the server
5. (Optional) Run `npm run seed` to seed demo data

## API Endpoints
- See `routes/` folder for all endpoints
