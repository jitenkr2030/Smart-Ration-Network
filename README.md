# QR Smart Ration Network 🚀

A modern, hybrid QR-based identity system with subscription-based ration supply management. Revolutionizing ration distribution with technology similar to "UPI jaisa network + BigBasket jaisa system".

## 🌟 Features

### 👤 User Features
- **QR-based Digital Identity**: Unique QR code for every user
- **Subscription Management**: Flexible monthly plans (Basic, Family, Premium)
- **Real-time Quota Tracking**: Monitor monthly ration allowance
- **Transaction History**: Complete record of all ration purchases
- **Family Member Management**: Add family members to subscription
- **Mobile-first Design**: Accessible on any device

### 🏪 Shop Partner Features
- **QR Scanner**: Instant customer verification
- **Dashboard Analytics**: Real-time sales and customer insights
- **Inventory Management**: Track stock levels and get alerts
- **Transaction Processing**: Quick and secure ration distribution
- **Customer Information**: View subscription details and quota status

### 🧑‍💻 Admin Features
- **User Management**: Manage all registered users
- **Shop Management**: Oversee partner network
- **Analytics Dashboard**: Comprehensive system insights
- **Subscription Oversight**: Monitor all active subscriptions
- **Transaction Monitoring**: Track all system transactions

## 💰 Business Model

### Subscription Plans
- **Basic**: ₹1,999/month - Perfect for individuals and couples
  - Basic ration essentials
  - Monthly quota tracking
  - Access to 5+ partner shops
  - Email support

- **Family Pack**: ₹3,999/month - Ideal for families of 4-6 members
  - Complete family ration
  - Priority support
  - Access to 15+ partner shops
  - Monthly reports
  - Family member management

- **Premium**: ₹5,999/month - For large families and special needs
  - Premium ration items
  - Dedicated support
  - Unlimited shop access
  - Custom quota management
  - Advanced analytics
  - Priority delivery

### Revenue Streams
- **Subscription Fees**: Recurring monthly revenue from users
- **Commission Model**: Platform fee on each transaction
- **B2B Expansion**: NGOs, hostels, PGs, factories

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **State Management**: Zustand, TanStack Query

### Backend
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with bcryptjs
- **API**: RESTful endpoints
- **QR Generation**: qrcode library
- **File Upload**: Native handling

### Development Tools
- **Package Manager**: Bun
- **Code Quality**: ESLint
- **Type Checking**: TypeScript
- **Database Migrations**: Prisma

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jitenkr2030/Smart-Ration-Network.git
   cd Smart-Ration-Network
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   bun run db:push
   bun run db:seed
   ```

5. **Start the development server**
   ```bash
   bun run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Demo Accounts

The system comes pre-seeded with demo accounts:

### User Account
- **Email**: demo@user.com
- **Mobile**: 9876543210
- **Password**: demo123

### Shop Partner Account
- **Email**: demo@shop.com
- **Mobile**: 9876543211
- **Password**: demo123

### Admin Account
- **Email**: admin@qr-ration.com
- **Mobile**: 9876543212
- **Password**: admin123

## 🗂️ Project Structure

```
Smart-Ration-Network/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # User dashboard
│   │   ├── shop/              # Shop partner pages
│   │   ├── login/             # Authentication pages
│   │   └── register/          # Registration pages
│   ├── components/            # Reusable UI components
│   │   └── ui/               # shadcn/ui components
│   └── lib/                   # Utility libraries
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts              # Database seeding
├── public/                   # Static assets
└── README.md
```

## 📊 Database Schema

### Core Tables
- **users**: User accounts and QR codes
- **shops**: Partner shop information
- **subscription_plans**: Available subscription tiers
- **subscriptions**: User subscription records
- **products**: Available ration items
- **transactions**: Ration purchase records
- **inventory**: Shop stock management
- **admins**: System administrators

### Key Relationships
- Users → Subscriptions (one-to-many)
- Users → Transactions (one-to-many)
- Shops → Transactions (one-to-many)
- Shops → Inventory (one-to-many)
- Subscriptions → Plans (many-to-one)

## 🔧 Available Scripts

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server

# Database
bun run db:push      # Push schema to database
bun run db:generate  # Generate Prisma client
bun run db:seed      # Seed database with demo data
bun run db:reset     # Reset database

# Code Quality
bun run lint         # Run ESLint
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/qrcode` - Generate QR code
- `POST /api/auth/qrcode` - Verify QR code

### Subscription Plans
- `GET /api/subscription-plans` - Get all plans
- `POST /api/subscription-plans` - Create new plan

### Users
- `GET /api/users` - List users (admin)
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user

### Shops
- `GET /api/shops` - List shops
- `POST /api/shops` - Register new shop
- `GET /api/shops/[id]` - Get shop details

## 🎯 Use Cases

### For Individuals & Families
- Digital ration card replacement
- Monthly quota management
- Access to nearby partner shops
- Family member inclusion

### For Shop Owners
- Modern customer verification
- Real-time inventory tracking
- Increased customer base
- Simplified transaction processing

### For Government & NGOs
- Transparent distribution system
- Real-time monitoring
- Reduced fraud and leakage
- Data-driven policy making

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **QR Code Security**: Encrypted QR data with timestamps
- **Input Validation**: Comprehensive input sanitization
- **CORS Protection**: Proper cross-origin resource sharing
- **Environment Variables**: Secure configuration management

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Docker
```bash
# Build the image
docker build -t smart-ration-network .

# Run the container
docker run -p 3000:3000 smart-ration-network
```

### Traditional Hosting
```bash
# Build for production
bun run build

# Start the production server
bun run start
```

## 📈 Roadmap

### Phase 1 - Core Features ✅
- [x] User authentication and QR generation
- [x] Shop partner interface
- [x] Basic dashboard functionality
- [x] Subscription management

### Phase 2 - Advanced Features
- [ ] Payment gateway integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] AI-powered demand prediction

### Phase 3 - Enterprise Features
- [ ] Multi-tenant support
- [ ] Advanced reporting
- [ ] API for third-party integrations
- [ ] Wholesale distribution management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and inquiries:
- Email: support@qr-ration.com
- GitHub Issues: [Create an issue](https://github.com/jitenkr2030/Smart-Ration-Network/issues)
- Documentation: [Wiki](https://github.com/jitenkr2030/Smart-Ration-Network/wiki)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma for the excellent ORM
- shadcn/ui for beautiful components
- Tailwind CSS for utility-first styling

---

**QR Smart Ration Network** - Transforming ration distribution with technology 🚀

Made with ❤️ for Modern India