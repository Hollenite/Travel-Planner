# Smart Travel Planner

A production-level React application that helps users plan trips, manage budgets, and organize travel documents all in one place.
**DEMO VIDEO LINK - https://youtu.be/rH7hMZXoPag**

## Problem Statement

**Who is the user?**
Travelers and trip planners who need to coordinate multiple aspects of a trip (itinerary, budget, documents) efficiently.

**What problem is being solved?**
Trip planning typically requires juggling multiple tools—calendar apps for itineraries, spreadsheets for budgets, email for booking documents. This application consolidates all these into one cohesive platform with AI-powered itinerary generation.

**Why it matters?**

- Reduces planning friction by centralizing trip information
- Provides AI-generated daily itineraries based on user preferences, budget, and interests
- Tracks actual spending against planned budgets
- Organizes important travel documents and references in one secure location
- Real-time synchronization across devices via Firebase

## Core Features

### 1. **Smart Trip Planning**

- Multi-step guided planner to collect trip details (destination, dates, travelers, interests, budget)
- AI-powered itinerary generation using Groq API (LLaMA 3.3 70B)
- Day-by-day activity recommendations with costs, timing, and insider tips
- Includes accommodation suggestions, meal recommendations, packing lists, and emergency info

### 2. **Budget Management**

- View AI-estimated trip budget breakdown (accommodation, food, transport, activities)
- Track actual expenses with categorization (food, accommodation, transport, activities, shopping, other)
- Real-time budget usage monitoring with visual progress indicator
- Compare actual spending against planned budget

### 3. **Travel Document Management**

- Organize important travel documents: passports, visas, tickets, bookings, insurance
- Store document links and references for easy access
- Add, edit, and delete document entries
- Persistent storage in Firebase

### 4. **Authentication & Authorization**

- Google OAuth sign-in for secure access
- Protected routes—only logged-in users can access trip data
- User-specific trip isolation (users only see their own trips)

### 5. **Trip Management Dashboard**

- Real-time statistics: total trips, unique destinations, upcoming trips, completed trips
- Recent trips overview with quick access
- Comprehensive "My Trips" page with search, filter, and sort capabilities
- Trip status tracking (upcoming, ongoing, completed, draft)
- Edit trip metadata (status, personal notes)
- One-click trip deletion from My Trips page

### 6. **User Profile & Settings**

- Profile display with account information
- Travel statistics overview
- Sign out functionality

## Tech Stack

- **Frontend Framework:** React 19.2.4 with Vite
- **Routing:** React Router DOM 7.13.1
- **Styling:** Tailwind CSS 3.4.19 with PostCSS
- **Icons:** Lucide React 0.577.0
- **Backend & Database:** Firebase
  - Firebase Authentication (Google Sign-In)
  - Firestore (NoSQL database)
  - Firebase Storage (for document file storage)
- **AI Integration:** Groq API (LLaMA 3.3 70B model)
- **Build Tool:** Vite 8.0.1
- **Linting:** ESLint with React Hooks plugin

## Project Structure

```
src/
├── App.jsx                          # Main router component with lazy loading
├── main.jsx                         # React entry point
├── config/
│   └── firebase.js                  # Firebase initialization
├── context/
│   └── AuthContext.jsx              # Global authentication state
├── hooks/
│   ├── useTrip.js                   # Trip planning form state management
│   ├── useUserTrips.js              # Fetch and compute trip statistics
│   ├── useExpenses.js               # Expense tracking (CRUD operations)
│   └── useDocuments.js              # Document management (CRUD operations)
├── routes/
│   └── ProtectedRoute.jsx           # Route guard for authenticated pages
├── services/
│   └── groqService.js               # AI itinerary generation service
├── pages/
│   ├── LandingPage.jsx              # Public landing/sign-in page
│   ├── Dashboard.jsx                # Main dashboard with stats and recent trips
│   ├── PlanTrip.jsx                 # Multi-step trip planner
│   ├── TripDetail.jsx               # Trip view with itinerary, budget, documents
│   ├── MyTrips.jsx                  # All trips listing with CRUD management
│   └── Settings.jsx                 # User profile and settings
├── components/
│   ├── layout/
│   │   ├── AppShell.jsx             # Global layout wrapper
│   │   ├── Header.jsx               # Navigation header
│   │   ├── Sidebar.jsx              # Side navigation
│   │   └── BottomNav.jsx            # Mobile bottom navigation
│   ├── dashboard/
│   │   ├── StatsCard.jsx            # Statistics display card
│   │   ├── QuickPlanCard.jsx        # Quick trip planner CTA
│   │   └── TripCard.jsx             # Trip preview card
│   ├── planner/
│   │   ├── StepIndicator.jsx        # Multi-step form indicator
│   │   ├── GeneratingScreen.jsx     # Loading state during generation
│   │   └── steps/                   # Individual form steps
│   │       ├── StepDestination.jsx
│   │       ├── StepDates.jsx
│   │       ├── StepTravelers.jsx
│   │       ├── StepInterests.jsx
│   │       ├── StepBudget.jsx
│   │       └── StepSpecial.jsx
│   ├── itinerary/
│   │   ├── TripHeader.jsx           # Trip banner and metadata
│   │   ├── OverviewSection.jsx      # Trip summary
│   │   ├── BudgetCard.jsx           # Budget overview
│   │   ├── ExpenseTracker.jsx       # Expense management UI
│   │   ├── DocumentManager.jsx      # Document management UI
│   │   ├── DayCard.jsx              # Daily itinerary view
│   │   ├── QuickTipsSection.jsx     # Travel tips
│   │   └── PackingList.jsx          # Packing list
│   └── ui/
│       ├── Button.jsx               # Reusable button component
│       ├── Avatar.jsx               # User avatar
│       └── LoadingSpinner.jsx       # Loading indicator
└── assets/                          # Static assets

```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account and project
- Groq API key

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd travel-planner
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the project root:

   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_GROQ_API_KEY=your_groq_api_key
   ```

4. **Configure Firebase**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Google Authentication
   - Create a Firestore database (start in test mode for development)
   - Enable Firebase Storage
   - Copy your credentials to `.env.local`

5. **Configure Groq API**
   - Sign up at https://console.groq.com
   - Create an API key
   - Add it to `.env.local` as `VITE_GROQ_API_KEY`

6. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Firebase Database Schema

### Collections

**users**

```javascript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  createdAt: timestamp,
  tripsCount: number
}
```

**trips**

```javascript
{
  userId: string (owner ID),
  tripName: string,
  destination: string,
  startDate: date,
  endDate: date,
  duration: number,
  status: enum['upcoming', 'ongoing', 'completed', 'draft'],
  travelers: { adults: number, children: number },
  tripType: string,
  interests: [string],
  budget: enum['budget', 'moderate', 'luxury'],
  specialRequests: string,
  notes: string,
  itinerary: object,
  createdAt: timestamp,
  updatedAt: timestamp,
  isPublic: boolean
}
```

**trips/{tripId}/expenses** (subcollection)

```javascript
{
  category: enum['food', 'accommodation', 'transport', 'activities', 'shopping', 'other'],
  description: string,
  amount: number,
  date: date,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**trips/{tripId}/documents** (subcollection)

```javascript
{
  name: string,
  type: enum['passport', 'visa', 'ticket', 'booking', 'insurance', 'itinerary', 'receipt', 'link', 'other'],
  link: string,
  fileName: string (optional, for file uploads),
  fileSize: number (optional),
  storageRef: string (optional, Firebase Storage path),
  uploadedAt: timestamp
}
```

## CRUD Operations

### Trips

- **Create:** Multi-step planner form → Firestore (with AI-generated itinerary)
- **Read:** Dashboard (recent trips), MyTrips (all trips), TripDetail (single trip)
- **Update:** TripDetail edit form (status, notes) via `updateDoc`
- **Delete:** MyTrips page, one-click delete via `deleteDoc`

### Expenses

- **Create:** ExpenseTracker form → Firestore subcollection
- **Read:** Real-time listener on `trips/{tripId}/expenses`
- **Update:** Edit expense amount/category
- **Delete:** Delete button on each expense

### Documents

- **Create:** DocumentManager form → Firestore subcollection
- **Read:** Real-time listener on `trips/{tripId}/documents`
- **Update:** Edit document name/description
- **Delete:** Delete button on each document

## React Concepts Demonstrated

### Core Concepts

- ✅ **Functional Components** - All components are functional
- ✅ **Props & Component Composition** - Nested component hierarchy with prop drilling
- ✅ **State Management (useState)** - Form state, UI state, async operation state
- ✅ **Side Effects (useEffect)** - Data fetching, real-time listeners, cleanup
- ✅ **Conditional Rendering** - Loading states, error states, empty states
- ✅ **Lists & Keys** - Rendered lists with unique keys

### Intermediate Concepts

- ✅ **Lifting State Up** - Auth state in context, form state in hooks
- ✅ **Controlled Components** - Form inputs with onChange handlers
- ✅ **Routing (React Router)** - Multi-page app with protected routes
- ✅ **Context API** - AuthContext for global authentication state

### Advanced Concepts

- ✅ **Custom Hooks** - useTrip, useUserTrips, useExpenses, useDocuments
- ✅ **Lazy Loading** - React.lazy with Suspense for code splitting
- ✅ **Real-time Listeners** - Firebase onSnapshot for reactive data
- ✅ **Performance Optimization** - Lazy-loaded routes, memoized calculations

## Authentication Flow

1. User lands on `/` (LandingPage)
2. Clicks "Sign in with Google"
3. Firebase handles authentication via popup
4. On successful auth, user document created in Firestore
5. Redirects to `/dashboard` (protected by ProtectedRoute)
6. All subsequent navigations protected

## How to Add a New Feature

1. **Create data hook** in `src/hooks/` (e.g., useFeature.js)
2. **Create UI component** in appropriate `src/components/` folder
3. **Add to appropriate page** (e.g., TripDetail, Dashboard)
4. **Add Firestore CRUD** in the hook using `addDoc`, `updateDoc`, `deleteDoc`, etc.
5. **Use real-time listeners** with `onSnapshot` for reactive updates

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Considerations

- Route-level code splitting with React.lazy
- Real-time data listeners (only when needed)
- Memoized calculations for stats
- Efficient Firestore queries with indexed collections
- Responsive image handling with CSS

## Troubleshooting

**Issue: "VITE_GROQ_API_KEY not configured"**

- Solution: Add `VITE_GROQ_API_KEY` to `.env.local`

**Issue: Firestore connection timeout**

- Solution: Check ad blocker settings, may be blocking Firestore

**Issue: Google Sign-In popup blocked**

- Solution: Allow popups from the domain in browser settings

**Issue: No trips showing on dashboard**

- Solution: Create a trip first via `/plan` route, data loads real-time

## Project Status

This is a complete, production-ready travel planning application suitable for:

- ✅ Course submission portfolio
- ✅ Real users to plan trips
- ✅ Further feature expansion
- ✅ Deployment to production

## Future Enhancements (if needed)

- Weather API integration for destinations
- Collaborative trip planning (invite friends)
- Trip auto-save drafts
- Export itinerary to PDF
- Mobile app (React Native)
- Trip recommendations based on history
- Multi-language support

## License

This project is open source and available under the MIT License.

## Author

Built as a comprehensive React course submission demonstrating:

- React fundamentals and best practices
- State management with hooks and context
- Firebase integration
- Responsive UI design
- Production-level code organization

---

**Smart Travel Planner** - Build trips smarter, travel better 🚀
