# SMART Expense Tracker

A comprehensive web-based expense tracking application that helps users manage their finances efficiently with features for income tracking, expense categorization, and detailed financial reports.

## 🌟 Features

- **User Authentication**: Secure login and signup with JWT-based authentication
- **Dashboard**: Real-time overview of income, expenses, and balance
- **Expense Management**: Add, edit, and delete expenses with categories
- **Income Tracking**: Record multiple income sources
- **Category Management**: Create and manage custom expense categories
- **Financial Reports**: Detailed analytics and visualizations of spending patterns
- **Transaction History**: Complete transaction history with filtering options
- **User Profile**: Manage user account and settings
- **Admin Panel**: Admin dashboard for user and system management
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **CSS3** - Styling
- **Axios** - HTTP client
- **React Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication

### Testing
- **JavaScript (Node.js)** - Backend testing
- **Python** - Integration testing

## 📁 Project Structure

```
SMART-EXPENSE-TRACKER/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth context
│   │   ├── api/           # API configuration
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── middleware/        # Authentication middleware
│   ├── server.js
│   └── package.json
├── tests/                  # Test files
│   ├── *.js              # JavaScript tests
│   └── *.py              # Python tests
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with required variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

4. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:3000`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/categories` - Get categories
- `POST /api/admin/categories` - Create category

## 🧪 Testing

### Run JavaScript Tests
```bash
npm test
```

### Run Python Tests
```bash
python -m pytest tests/
```

## 📱 Pages

- **Landing Page** - Welcome page with feature overview
- **Login** - User login page
- **Signup** - User registration page
- **Dashboard** - Main user dashboard with overview
- **Add Expense** - Form to add new expenses
- **Add Income** - Form to add income
- **History** - View transaction history
- **Reports** - Financial analytics and charts
- **Manage Categories** - Create and manage expense categories
- **User Profile** - User account settings
- **Admin Dashboard** - Admin control panel
- **Manage Users** - User management (admin only)
- **System Settings** - System configuration (admin only)

## 🌐 Deployment

### Frontend Deployment (Vercel)
The frontend is deployed on Vercel and can be accessed at:
- **Live URL**: https://smart-expense-tracker-opal.vercel.app/

To deploy your own version:
1. Push to GitHub
2. Connect to Vercel
3. Deploy with one click

### Backend Deployment
Backend can be deployed on platforms like:
- Railway
- Render
- Heroku
- AWS

## 🔐 Security Features

- JWT-based authentication
- Password hashing
- CORS protection
- Input validation
- Admin role verification

## 📊 Key Features Explained

### Dashboard
- Shows total income and expenses for current period
- Quick add buttons for expenses/income
- Recent transactions preview
- Balance overview

### Expense Tracking
- Add expenses with date, amount, category, and description
- Edit and delete transactions
- Filter by category and date range
- Track recurring expenses

### Reports
- Monthly expense analysis
- Category-wise breakdown
- Income vs expense comparison
- Spending trends visualization

### Admin Panel
- User management
- Category management
- System settings
- Analytics and reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Ved Savani**
- GitHub: [@vedsavani067-cmd](https://github.com/vedsavani067-cmd)
- Repository: [SMART-EXPENSE-TRACKER](https://github.com/vedsavani067-cmd/SMART-EXPENSE-TRACKER)

## 📞 Support

For support, email vedantsavani@example.com or open an issue on GitHub.

## 🗺️ Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Budget goals and alerts
- [ ] Bill reminders
- [ ] Data export (CSV, PDF)
- [ ] Multi-currency support
- [ ] Investment tracking
- [ ] Receipt scanning (OCR)
- [ ] Dark mode
- [ ] Multi-language support

---

**Last Updated**: May 20, 2026
**Version**: 1.0.0
