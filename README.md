# SyncBooker Frontend

A minimalistic and monochromatic scheduling platform built with Next.js 15, inspired by Calendly.

## 🎨 Design Philosophy

- **Monochromatic**: Clean black, white, and gray color palette
- **Minimalistic**: Simple, focused UI with no unnecessary elements
- **Modern**: Built with the latest web technologies

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (New York style)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Date Handling**: date-fns
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page
│   │   └── signup/         # Signup page
│   ├── dashboard/
│   │   ├── availability/   # Set weekly availability
│   │   ├── bookings/       # View all bookings
│   │   ├── events/         # Manage event types
│   │   │   └── new/        # Create new event type
│   │   └── settings/       # Account settings
│   ├── [username]/
│   │   └── [eventSlug]/    # Public booking page
│   ├── layout.tsx
│   ├── page.tsx            # Landing page
│   └── globals.css
├── components/
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── dashboard-layout.tsx
│   │   ├── dashboard-stats.tsx
│   │   ├── upcoming-bookings.tsx
│   │   └── quick-actions.tsx
│   ├── ui/                 # shadcn components (54 components)
│   └── providers.tsx       # React Query provider
└── lib/
    └── utils.ts            # Utility functions
```

## ✨ Features Implemented

### Landing Page
- Clean hero section with CTA
- Feature highlights
- Responsive design

### Authentication
- Login page
- Signup page
- Form validation

### Dashboard
- **Overview**: Stats cards, upcoming bookings, quick actions
- **Event Types**: Create and manage different meeting types
- **Availability**: Set weekly working hours
- **Bookings**: View upcoming, past, and all bookings
- **Settings**: Profile and account management

### Public Booking
- Calendar date picker
- Available time slots
- Booking form with confirmation
- Success confirmation page

## 🎯 Key Features

1. **Event Management**
   - Create multiple event types
   - Set custom durations (15-120 minutes)
   - Add descriptions

2. **Availability Management**
   - Set weekly schedule
   - Toggle days on/off
   - Custom start/end times

3. **Booking System**
   - Public booking pages
   - Date and time selection
   - Email confirmations
   - Booking status tracking

4. **User Experience**
   - Toast notifications
   - Loading states
   - Responsive design
   - Dark mode ready

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## 📄 Available Routes

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/[username]/[eventSlug]` - Public booking page

### Protected Routes (Dashboard)
- `/dashboard` - Dashboard overview
- `/dashboard/events` - Event types list
- `/dashboard/events/new` - Create new event
- `/dashboard/availability` - Set availability
- `/dashboard/bookings` - View bookings
- `/dashboard/settings` - Account settings

## 🎨 Design System

### Colors
- **Background**: `#ffffff` (light) / `#0a0a0a` (dark)
- **Foreground**: `#0a0a0a` (light) / `#fafafa` (dark)
- **Primary**: `#0a0a0a` (light) / `#fafafa` (dark)
- **Muted**: `#f5f5f5` (light) / `#262626` (dark)
- **Border**: `#e5e5e5` (light) / `#262626` (dark)

### Typography Utilities
- `heading-xl` - 3rem, bold
- `heading-lg` - 2.25rem, bold
- `heading-md` - 1.875rem, semibold
- `heading-sm` - 1.5rem, semibold
- `body-lg` - 1.125rem
- `body-md` - 1rem
- `body-sm` - 0.875rem
- `label-md` - 0.875rem, medium
- `label-sm` - 0.75rem, medium, uppercase

### Border Radius
- Default: `8px`

## 🔧 Configuration

### Tailwind CSS v4
The project uses Tailwind CSS v4 with custom utilities defined in `src/app/globals.css`.

### shadcn/ui
All UI components are pre-installed. Configuration in `components.json`:
- Style: New York
- Base color: Neutral
- CSS variables: Enabled

## 📝 Next Steps

To complete the full-stack application:

1. **Backend Integration**
   - Connect to Express.js API
   - Implement JWT authentication
   - Set up database with TypeORM + Supabase

2. **Additional Features**
   - Google Calendar integration
   - Email notifications (Maileroo)
   - Time zone handling
   - Recurring availability
   - Payment integration

3. **Enhancements**
   - Team scheduling
   - Custom branding
   - Analytics dashboard
   - Automated reminders

## 📦 Dependencies

### Core
- `next` - React framework
- `react` - UI library
- `typescript` - Type safety

### UI & Styling
- `tailwindcss` - Utility-first CSS
- `@tailwindcss/postcss` - PostCSS plugin
- `lucide-react` - Icons
- `shadcn/ui` - Component library

### State & Data
- `zustand` - State management
- `@tanstack/react-query` - Data fetching
- `date-fns` - Date utilities

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

Built with ❤️ using Next.js and shadcn/ui