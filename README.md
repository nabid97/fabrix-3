# FabriX - Custom Clothing and Fabric E-Commerce Platform

FabriX is a comprehensive e-commerce platform specializing in custom clothing and premium fabrics for businesses. The application features a modern, responsive UI with features for product browsing, customization, logo generation, and ordering.

## 🌟 Features

- **Product Catalog**: Browse and filter clothing items and fabrics with advanced sorting options
- **User Authentication**: Secure login/registration with JWT and AWS Amplify
- **Shopping Cart**: Persistent cart with local storage
- **Customization Options**: Detailed product customization for clothing and fabrics
- **Logo Generator**: AI-powered logo generation for custom branding
- **Chatbot Support**: AI assistant for customer inquiries
- **Order Management**: Complete order processing with status tracking
- **Payment Processing**: Secure checkout with Stripe integration
- **Responsive Design**: Mobile-friendly UI built with React and Tailwind CSS
- **Real-time Product Updates**: Dynamic filtering and sorting capabilities

## 🚀 Technology Stack

### Frontend
- React 18 with TypeScript
- React Router v6 for navigation
- Tailwind CSS for styling with custom theme configuration
- Context API for state management (Auth, Cart, UI states)
- AWS Amplify for authentication
- Lucide React for iconography
- Axios for API requests with request/response interceptors
- Stripe.js for secure payment processing
- React Query for efficient API data fetching and caching

### Backend
- Node.js with Express
- TypeScript for type safety and improved developer experience
- MongoDB with Mongoose for data modeling
- JWT for secure authentication and authorization
- Stripe API for payment processing
- Google Gemini API for AI-powered chatbot functionality
- Stability AI for logo generation capabilities
- AWS S3 for scalable file storage
- Nodemailer for transactional email notifications

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or Atlas connection)
- AWS account with S3 bucket configured for image storage
- Stripe account for payment processing
- Google AI API key (for Gemini chatbot)
- Stability AI API key for logo generation

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/fabrix.git
   cd fabrix
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment variables**
   - Copy `.env.example` to `.env` in the server directory
   - Update with your configuration
   ```bash
   cp server/.env.example server/.env
   ```

   Required environment variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/fabrix
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_key
   AWS_S3_BUCKET=your_s3_bucket_name
   AWS_REGION=your_aws_region
   AWS_ACCESS_KEY=your_aws_access_key
   AWS_SECRET_KEY=your_aws_secret_key
   GOOGLE_AI_API_KEY=your_google_ai_key
   STABILITY_AI_KEY=your_stability_ai_key
   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_password
   ```

4. **Seed the database**
   ```bash
   cd server
   npm run seed
   ```

5. **Start development servers**
   ```bash
   cd ..
   npm run dev
   ```

## 🌐 Usage

After starting the development servers:
- Frontend runs on: http://localhost:3000
- Backend API runs on: http://localhost:5000

### Default Users

- Admin User:
  - Email: admin@fabrix.com
  - Password: password123

- Customer:
  - Email: john@example.com
  - Password: password123

## 📁 Project Structure

```
fabrix/
├── client/                      # Frontend React application
│   ├── public/                  # Static files
│   └── src/
│       ├── api/                 # API integration and service functions
│       ├── components/          # Reusable UI components
│       │   ├── common/          # Shared UI elements (buttons, inputs, etc.)
│       │   ├── layout/          # Layout components (header, footer, etc.)
│       │   ├── product/         # Product-specific components
│       │   └── user/            # User-related components
│       ├── contexts/            # React contexts for state management
│       ├── hooks/               # Custom React hooks
│       ├── pages/               # Page components
│       ├── styles/              # CSS and Tailwind configurations
│       ├── types/               # TypeScript type definitions
│       └── utils/               # Utility functions and helpers
│
├── server/                      # Backend Node.js application
│   ├── src/
│       ├── config/              # Configuration and environment setup
│       ├── controllers/         # API controllers and request handlers
│       ├── data/                # Sample data for seeding database
│       ├── middleware/          # Express middleware functions
│       ├── models/              # MongoDB schemas and models
│       ├── routes/              # API route definitions
│       ├── scripts/             # Utility scripts (data fixing, migrations)
│       ├── services/            # Business logic and external services
│       └── utils/               # Helper functions and utilities
│
└── infrastructure/              # Deployment & infrastructure
    ├── docker/                  # Docker configuration
    ├── kubernetes/              # Kubernetes manifests
    └── terraform/               # Terraform IaC
```

## 📄 API Documentation

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Products
- `GET /api/products` - Get all products with filtering capabilities
- `GET /api/products/:id` - Get a specific product by ID
- `GET /api/products/clothing` - Get clothing products
- `GET /api/products/fabric` - Get fabric products
- `POST /api/products` - Create a new product (admin)
- `PUT /api/products/:id` - Update a product (admin)
- `DELETE /api/products/:id` - Delete a product (admin)

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all user orders
- `GET /api/orders/:id` - Get specific order details
- `PUT /api/orders/:id/pay` - Update order to paid status
- `PUT /api/orders/:id/status` - Update order status (admin)

### Logo Generation
- `POST /api/logo/generate` - Generate a logo using AI
- `POST /api/logo/upload` - Upload a custom logo
- `GET /api/logo/user` - Get user's saved logos

### Chatbot
- `POST /api/chat/gemini` - Get AI chat response
- `GET /api/chat/faq` - Get quick FAQ response

## 🧪 Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
npm test

# Run specific test suite
npm test -- --testPathPattern=products

# Run with coverage report
npm test -- --coverage
```

## 🚢 Deployment

### Docker
```bash
# Build and run with Docker Compose
docker-compose up -d

# Build specific services
docker-compose build client server

# View logs
docker-compose logs -f
```

### Kubernetes
```bash
# Deploy to Kubernetes
kubectl apply -f infrastructure/kubernetes/manifests/

# Check deployment status
kubectl get deployments

# Scale the application
kubectl scale deployment fabrix-frontend --replicas=3
```

## 🔄 CI/CD

This project uses GitHub Actions for CI/CD. The workflow is defined in `.github/workflows/ci-cd.yaml`.

The pipeline includes:
- Code linting and formatting checks
- Unit and integration tests
- Build process for frontend and backend
- Docker image creation and publishing
- Deployment to staging/production environments

## 💻 Development Guidelines

### Code Style
- We use ESLint and Prettier for code formatting
- Run `npm run lint` to check for linting issues
- Run `npm run format` to automatically fix formatting

### Branching Strategy
- `main` - Production-ready code
- `develop` - Development branch for feature integration
- `feature/*` - For new features
- `bugfix/*` - For bug fixes
- `hotfix/*` - For urgent production fixes

### Pull Request Process
1. Ensure code passes all tests
2. Update documentation as needed
3. Get approval from at least one reviewer
4. Squash and merge to the target branch

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Known Issues and Limitations

- Product image URLs may need to be manually updated if S3 bucket configuration changes
- Mobile responsiveness is optimized for iOS and Android but may have issues on some tablet devices
- Logo generation has daily API usage limits based on the Stability AI plan

## 🔮 Future Enhancements

- Enhanced analytics dashboard for business insights
- Multi-language support
- Integration with additional payment gateways
- AR-based virtual try-on feature for clothing products
- Subscription-based ordering model

## 📞 Contact

- Project Link: [https://github.com/nabid97/fabrix](https://github.com/nabid97/fabrix)
- Developer: [nabidhossain1997@gmail.com](mailto:nabidhossain1997@gmail.com)

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [AWS](https://aws.amazon.com/)
- [Stripe](https://stripe.com/)
- [Google AI](https://ai.google/)
- [Stability AI](https://stability.ai/)

