# GrocerryPoint

GrocerryPoint is a full-stack e-commerce application for grocery shopping, built with React and Node.js.

## Technology Stack

### Frontend
- React 19
- React Router DOM
- Axios for API calls
- TailwindCSS for styling
- Recharts for data visualization
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Passport.js for social login (Google & Facebook)
- BCrypt for password hashing

## Project Structure

### Frontend (`/src`)
- `components/` - Reusable UI components
  - User interface elements like Header, Footer, ProductCard, etc.
  - Form components for addresses and checkout
  - Dashboard components
- `contexts/` - React Context providers
  - Authentication context
  - Shopping cart context
- `pages/` - Application pages
  - User-facing pages (Home, Products, Cart, etc.)
  - Admin dashboard pages
- `hooks/` - Custom React hooks
- `layouts/` - Page layout components
- `routes/` - Application routing configuration

### Backend (`/backend`)
- `controllers/` - Business logic handlers
  - User authentication
  - Product management
  - Order processing
  - Cart and wishlist operations
- `models/` - MongoDB schema definitions
- `routes/` - API route definitions
- `middlewares/` - Custom middleware functions
- `config/` - Configuration files

## Features

- User Authentication (Email & Social Login)
- Product Management
- Shopping Cart
- Wishlist
- Order Processing
- Address Management
- Admin Dashboard
- Order Tracking
- User Profile Management

## Getting Started

1. Install dependencies:
   ```bash
   # Frontend
   npm install

   # Backend
   cd backend
   npm install
   ```

2. Set up environment variables:
   - Copy `backend/setup-env.js` to create your `.env` file
   - Configure your database and social login credentials

3. Run the application:
   ```bash
   # Frontend
   npm run dev

   # Backend
   cd backend
   npm run dev
   ```

4. Seed the database (optional):
   ```bash
   cd backend
   npm run seed
   ```

## Development Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with Nodemon
- `npm run start` - Start production server
- `npm run seed` - Seed the database
- `npm run seed:destroy` - Clear seeded data
