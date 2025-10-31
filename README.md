# BookIt - Travel Experiences Booking Platform

A full-stack web application for browsing and booking travel experiences with real-time slot availability, promo code validation, and secure payment processing via Stripe.

## Features

- Browse Experiences: Grid view of travel experiences with search functionality
- Real-time Availability: Live slot availability checking and booking prevention
- Date & Time Selection: Interactive date and time slot picker with visual availability indicators
- Promo Codes: Apply discount codes (percentage or flat discount)
- Secure Payments: Stripe integration for safe payment processing
- Booking Confirmation: Unique reference ID generation for each booking
- Responsive Design: Mobile-first, fully responsive UI matching Figma design
- Search Functionality: Search experiences by name, location, or description
- Transaction Safety: Database-level transaction handling to prevent double-booking (Used Ai)

## Tech Stack

### Frontend
- Framework: Next.js 16.0.0
- Language: TypeScript
- Styling: TailwindCSS 4
- State Management: React Context API
- Payment: Stripe.js (Used Ai for help)
- HTTP Client: Native Fetch API

### Backend
- Runtime: Node.js
- Framework: Next.js API Routes
- Database: MySQL
- ORM: mysql2 with Promise support
- Payment Processing: Stripe API (Used ai)

## Prerequisites

- Node.js 18.x or higher
- MySQL 8.x or higher
- npm or yarn package manager
- Stripe account (for payment integration with the help of ai)

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/NOTBOOSTER/bookit.git
cd bookit
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:
```env
DB_HOST=your_mysql_host
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_database_password
DB_NAME=bookit_db

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key

NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Database Setup

The database schema will be automatically created when you first run the application. The schema includes:

- experiences: Travel experience listings
- slots: Available time slots for each experience
- bookings: Customer booking records
- promo_codes: Discount codes

Sample data will be seeded automatically on first run.

### 5. Run the development server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Project Structure
```
bookit/
├── app/
│   ├── api/
│   │   ├── experiences/route.ts
│   │   ├── promo/validate/route.ts
│   │   ├── create-checkout-session/route.ts
│   │   └── confirm-booking/route.ts
│   ├── components/
│   │   ├── checkout/
│   │   │   ├── CheckoutForm.tsx
│   │   │   └── CheckoutSummary.tsx
│   │   ├── experience/
│   │   │   ├── DatePicker.tsx
│   │   │   ├── TimePicker.tsx
│   │   │   ├── PricingSummary.tsx
│   │   │   └── ExperienceDetails.tsx
│   │   ├── home/
│   │   │   ├── Cards.tsx
│   │   │   ├── ExperienceCard.tsx
│   │   │   └── SkeletonCard.tsx
│   │   └── header.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── mysql.ts
│   │   │   └── schema.ts
│   │   ├── logger.ts
│   │   ├── types.ts
│   │   └── SearchContext.tsx
│   ├── experience/[id]/page.tsx
│   ├── checkout/page.tsx
│   ├── confirmation/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
│   └── logo.png
├── instrumentation.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## API Endpoints

### Experiences

**GET /api/experiences**
- Returns all available experiences
- Response: Array of experience objects

**GET /api/experiences?id={id}**
- Returns single experience with available slots
- Response: `{ experience: {...}, slots: [...] }`

### Promo Codes

**POST /api/promo/validate**
- Validates a promo code
- Request Body: `{ code: string }`
- Response: `{ code, discount_type, discount_value }`

### Payments

**POST /api/create-checkout-session**
- Creates Stripe checkout session
- Request Body: `{ experienceId, slotId, quantity, experienceName, total, email, fullName }`
- Response: `{ url: string }`

**GET /api/confirm-booking?session_id={session_id}**
- Confirms booking after successful payment
- Redirects to confirmation page with booking reference

## Application Flow
```
Home Page (/)
    ↓
Browse Experiences (fetched from backend)
    ↓
Experience Details (/experience/[id])
    ↓
View Available Slots & Select Date/Time
    ↓
Checkout Page (/checkout)
    ↓
Enter Details & Apply Promo Code
    ↓
Stripe Payment Processing
    ↓
Confirmation Page (/confirmation)
    ↓
Display Booking Reference ID
```

## Testing

### Test Promo Codes

| Code | Type | Discount |
|------|------|----------|
| SAVE10 | Percentage | 10% off |
| FLAT100 | Flat | Rs 100 off |
| WELCOME20 | Percentage | 20% off |

### Test Payment (Stripe)

Use Stripe test card for payments:
- Card Number: 4242 4242 4242 4242
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

## Design Implementation

The UI matches the provided Figma design with:
- Consistent spacing and typography across all breakpoints
- Responsive design for mobile, tablet, and desktop
- Interactive states (hover, active, disabled, loading)
- Loading skeleton screens
- Clear error and success feedback
- Sold-out and availability indicators

## Security Features

- SQL injection prevention with parameterized queries
- Transaction-based booking to prevent race conditions
- Email validation on frontend and backend
- Promo code validation and expiry checking
- Stripe secure payment handling
- Environment variable protection

## Development Commands
```bash
npm run dev     # Run development server
npm run build   # Build for production
npm start       # Start production server
npm run lint    # Lint code
```

## Assignment Requirements Checklist

**Frontend Requirements:**
- [x] React + TypeScript (Next.js 16)
- [x] TailwindCSS for styling
- [x] Home Page listing experiences
- [x] Details Page with slots and availability
- [x] Checkout Page with user info and promo codes
- [x] Result Page with booking confirmation
- [x] Responsive and mobile-friendly
- [x] State management using React hooks
- [x] Form validation (email, name, terms)
- [x] Clear feedback for all states
- [x] Design fidelity matching Figma

**Backend Requirements:**
- [x] Node.js with Next.js API Routes
- [x] MySQL database
- [x] GET /experiences endpoint
- [x] GET /experiences/:id endpoint
- [x] POST /bookings endpoint
- [x] POST /promo/validate endpoint
- [x] Field validation
- [x] Double-booking prevention

**Integration Requirements:**
- [x] Frontend consumes backend APIs
- [x] Complete flow: Home → Details → Checkout → Result
- [x] Dynamic data from database
- [x] Royalty-free images from Unsplash

**Deliverables:**
- [x] Complete fullstack application
- [x] Hosted on Vercel
- [x] Complete README with setup instructions
- [x] GitHub repository

## Live Demo

**Application:** https://bookit-gray.vercel.app/

**Repository:** https://github.com/NOTBOOSTER/bookit

## Assignment Context

This project was developed as part of the Fullstack Intern Assignment for Highway Delite. The assignment focuses on demonstrating fullstack development capabilities including:
- Frontend development with React, TypeScript, and TailwindCSS
- Backend API development with Node.js
- Database design and management with MySQL
- Payment integration with Stripe
- Real-world booking system implementation
- Responsive UI/UX design matching Figma specifications

## Contact

GitHub: https://github.com/NOTBOOSTER

Built with Next.js 16, TypeScript, TailwindCSS 4, and MySQL