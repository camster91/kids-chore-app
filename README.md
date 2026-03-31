# ChoreChamps (Kids Habit Tracker)

**A gamified, engaging chore and habit tracking application designed to help kids build responsibility through positive reinforcement.**

As part of the **Nexus AI Family Suite** (alongside Family Planner), ChoreChamps is an interactive application being prepped for consolidation and app store release. The goal is to make household management seamless and fun, using points, badges, and rewards.

## 🚀 Vision: Gamified Household Tasks

We are positioning ChoreChamps to be either a standalone native application (via Capacitor) or a core module within a unified GlowOS Household app.
- **Parent Dashboard:** Assign tasks, set point values, and approve completed chores.
- **Kid Interface:** A highly visual, avatar-driven experience where chores turn into quests.
- **AI Integration (Planned):** Utilize a GlowOS "Parent Agent" to dynamically suggest age-appropriate chores and adjust rewards based on weekly completion consistency.

## 🛠 Tech Stack

- **Frontend:** React + TypeScript
- **Styling:** Tailwind CSS + Framer Motion for gamified animations
- **State:** Zustand / Context API
- **Build/Bundle:** Vite
- **Mobile Target:** Capacitor for iOS/Android

## ⚡ Getting Started

```bash
# Clone the repository
git clone https://github.com/camster91/kids-chore-app.git
cd kids-chore-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:5173`.

## 📈 Roadmap to App Store

- [ ] Consolidate user authentication with the `family-planner` module for seamless parent logins.
- [ ] Add the push notification pipeline to remind kids of pending daily quests.
- [ ] Generate Android Keystore and iOS Provisioning Profiles for App Store submission.
- [ ] Implement optional subscription tiers for premium avatars/badges using the daily usage reset framework.

---
*Developed by Cameron Ashley / Nexus AI.*
