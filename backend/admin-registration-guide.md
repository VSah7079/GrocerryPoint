# Admin Registration API Guide

## 🔐 Admin Registration Endpoint

**POST** `http://localhost:5000/api/auth/admin/register`

### 📋 Required Fields in Request Body (JSON):

```json
{
  "name": "Admin Name",
  "email": "admin@example.com", 
  "password": "admin123",
  "phone": "+91-1234567890",
  "adminKey": "admin_secret_key_2024"
}
```

### 📝 Field Descriptions:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | ✅ Yes | Admin's full name |
| `email` | String | ✅ Yes | Admin's email (must be unique) |
| `password` | String | ✅ Yes | Admin password (min 6 characters) |
| `phone` | String | ❌ No | Admin's phone number |
| `adminKey` | String | ✅ Yes | Secret key for admin registration |

### 🔑 Admin Key:
- Default: `admin_secret_key_2024`
- Can be changed in environment variables: `ADMIN_REGISTRATION_KEY`

### 📤 Success Response (201 Created):

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "66f8a1234567890abcdef123",
      "name": "Admin Name",
      "email": "admin@example.com", 
      "role": "admin",
      "isAdmin": true,
      "isVerified": true,
      "phone": "+91-1234567890",
      "createdAt": "2025-10-02T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Admin registered successfully"
}
```

### ❌ Error Responses:

**400 Bad Request - Missing Fields:**
```json
{
  "success": false,
  "error": "Name, email, password, and admin key are required."
}
```

**400 Bad Request - Email Exists:**
```json
{
  "success": false,
  "error": "Email already registered."
}
```

**401 Unauthorized - Wrong Admin Key:**
```json
{
  "success": false,
  "error": "Invalid admin registration key."
}
```

## 🧪 Testing in Postman:

### Step 1: Create POST Request
1. Open Postman
2. Create new request: `POST http://localhost:5000/api/auth/admin/register`
3. Set Headers:
   - `Content-Type: application/json`

### Step 2: Add Request Body
Select "raw" → "JSON" and paste:

```json
{
  "name": "Super Admin",
  "email": "superadmin@grocerrypoint.com", 
  "password": "superadmin123",
  "phone": "+91-9876543210",
  "adminKey": "admin_secret_key_2024"
}
```

### Step 3: Send Request
- Click "Send"
- You should get a 201 Created response with admin details and JWT token

### Step 4: Verify Admin Login
Test the created admin with login endpoint:

**POST** `http://localhost:5000/api/auth/admin-login`

```json
{
  "email": "superadmin@grocerrypoint.com",
  "password": "superadmin123"
}
```

## 🛡️ Security Features:

1. **Admin Key Protection**: Requires secret key to register
2. **Auto-Verification**: Admin accounts are automatically verified
3. **Role Assignment**: Automatically sets role to 'admin' and isAdmin to true
4. **JWT Token**: Returns authentication token for immediate use
5. **Unique Email**: Prevents duplicate admin emails

## 🎯 What Gets Added to Database:

```javascript
{
  _id: ObjectId,
  name: "Admin Name",
  email: "admin@example.com",
  password: "hashed_password", // Automatically hashed by bcrypt
  role: "admin",
  isAdmin: true,
  isVerified: true,
  isActive: true,
  phone: "+91-1234567890",
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Next Steps After Registration:

1. ✅ Admin is created and verified
2. ✅ Can login at: `http://localhost:5173/admin/login`
3. ✅ Has access to all admin features:
   - Dashboard analytics
   - Product management
   - Order management
   - Customer management

## 🔧 Environment Setup:

Add to your `.env` file (optional):
```
ADMIN_REGISTRATION_KEY=your_custom_secret_key_here
```

If not set, defaults to: `admin_secret_key_2024`