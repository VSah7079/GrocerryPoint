# 📧 Email Configuration Guide for GrocerryPoint

## 🚀 Gmail Setup (Recommended)

### Step 1: Gmail Account Settings
1. **Gmail account बनाएं** (अगर नहीं है तो)
2. **2-Factor Authentication enable** करें
3. **App Passwords generate** करें

### Step 2: App Password Generate करना
1. Google Account settings में जाएं
2. "Security" section में जाएं  
3. "2-Step Verification" enable करें
4. "App passwords" पर click करें
5. "Mail" select करें और "Generate" करें
6. **16-digit password** copy करें (spaces के साथ: `abcd efgh ijkl mnop`)

### Step 3: Environment Variables (.env file)
```bash
# Real Gmail Configuration
EMAIL_FROM=youremail@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
FRONTEND_URL=http://localhost:5173
```

## 🧪 Testing Email Functions

### 1. Signup Email Verification
- User signup करते समय automatic email भेजा जाएगा
- Route: `POST /api/auth/register`

### 2. Password Reset Email  
- Forgot password page से email भेजा जाएगा
- Route: `POST /api/auth/forgot-password`

### 3. Order Confirmation Email
- Order complete होने पर email भेजा जाएगा
- Route: `POST /api/orders`

## 🔧 Verification Steps

### Backend Test:
```bash
cd backend
npm start
```

### Frontend Test:
```bash  
cd Frontend
npm run dev
```

### Test Process:
1. **Signup Test**: http://localhost:5173/signup
   - नया account बनाएं
   - Email check करें verification link के लिए

2. **Login Test**: http://localhost:5173/login
   - Existing account से login करें

3. **Forgot Password Test**: http://localhost:5173/forgot-password
   - Email डालकर reset link request करें
   - Email में reset link check करें

4. **Admin Test**: http://localhost:5173/admin/login
   - Admin credentials: admin@grocerrypoint.com / admin123

## ⚠️ Common Issues & Solutions

### Issue 1: "Invalid credentials" error
**Solution**: 
- App password correctly copy करें (spaces के साथ)
- 2FA enable करें Gmail में

### Issue 2: Emails not sending
**Solution**:
- EMAIL_FROM में actual Gmail address डालें
- EMAIL_PASSWORD में app password डालें (account password नहीं)

### Issue 3: Development testing
**Solution**:
- अगर real email नहीं चाहिए तो .env में email variables comment कर दें
- Ethereal Email automatically use होगा testing के लिए

## 📱 Real Email vs Test Email

### Real Email (Production):
```bash
EMAIL_FROM=grocerrypoint@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### Test Email (Development):
```bash  
# EMAIL_FROM=
# EMAIL_PASSWORD=
# (Comment out करें या empty रखें)
```

## 🎯 Next Steps
1. Gmail app password generate करें
2. .env file में credentials update करें  
3. Backend restart करें
4. Signup/Login test करें
5. Email inbox check करें

**Happy Coding! 🚀**