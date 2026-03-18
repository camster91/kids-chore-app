# Kids Chore App

A gamified chore tracking application designed to make household tasks fun and engaging for children.

## ✨ Features

- **Gamified Tracking**: Earn points and rewards for completing chores
- **Interactive Dashboard**: Visual progress tracking and achievements
- **Task Management**: Create, assign, and track chores with due dates
- **Reward System**: Motivate kids with points and unlockable rewards
- **Progress Visualization**: See accomplishments and streaks
- **User-friendly Interface**: Kid-friendly design with animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd kids-chore-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up the database
npx prisma generate
npx prisma db push

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Usage

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.5 (App Router)
- **Language**: TypeScript 5
- **Database**: Prisma ORM + Supabase
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **UI Utilities**: clsx, tailwind-merge

## 📁 Project Structure

```
kids-chore-app/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   └── lib/             # Utility functions and configurations
├── prisma/              # Database schema and migrations
├── public/              # Static assets
└── types/               # TypeScript type definitions
```

## 🔒 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="your-database-url"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

## 🎮 Gamification Features

- **Points System**: Earn points for completed chores
- **Achievements**: Unlock badges and milestones
- **Leaderboards**: Friendly family competition
- **Rewards**: Redeem points for real-world rewards
- **Streaks**: Build consistency with daily/weekly streaks

## 📄 License

**Private** - This project is proprietary and not licensed for public use.

## 🤝 Contributing

This is a private project. Contributions are not currently accepted.

---

Built with ❤️ using Next.js
