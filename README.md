# 🏋️ GYM.LOG — Gym Tracker

Personal gym tracking web app built with **Next.js 14 + Supabase**.

Supports all exercise types:
- **Weighted** (Bench Press, Squat) → weight × reps per set
- **Time-based** (Dead Hang, Plank) → duration in seconds per set
- **Bodyweight Variable** (Pull-Ups, Dips) → reps per set (each set logged independently)
- **Weighted Bodyweight** (Weighted Pull-Ups) → optional added weight + reps

Export workouts to **JSON** (AI-parseable) or **Markdown** (human + AI readable).

---

## ⚡ Quick Setup

### 1. Clone & Install

```bash
# If you received as zip, unzip and enter directory
cd gym-tracker
npm install
```

### 2. Setup Supabase

1. Go to [supabase.com](https://supabase.com) → New Project
2. Go to **SQL Editor** → Run `supabase/schema.sql` FIRST, then apply all files in `supabase/migrations/` in order.
3. Go to **Settings → API** → copy your **Project URL** and **anon key**

### 3. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 4. Run

```bash
npm run dev
# Open http://localhost:3000
```

---

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard — stats & recent sessions |
| `/log` | Log a new workout session |
| `/history` | View all past sessions, export |
| `/progress` | Charts — volume, strength trends, muscle distribution |
| `/auth/login` | Sign in with premium Auth UI |
| `/auth/register` | Join the club (simplified 3-field enlisting) |

---

## 📤 Exporting for AI Analysis

On the **History** page:
- Check/uncheck sessions to select specific ones (or export all)
- Click **JSON** for structured machine-readable export
- Click **MD** for Markdown summary

Then paste the exported file content to your AI chat and ask for analysis, e.g.:
> "Here's my gym log for the past month. What muscle groups am I neglecting? What's my strength trend on bench press?"

---

## 🏗 Tech Stack

- **Next.js 14** (App Router)
- **Supabase** (PostgreSQL + `@supabase/ssr` Auth)
- **Tailwind CSS** (styling)
- **SWR** (Data fetching & caching)
- **Zod** (API Schema validation)
- **Vitest & RTL** (Unit testing)
- **Lucide-react** (icons)
- **Recharts** (progress charts)
- **date-fns** (date utilities)

---

## 📋 Exercise Library

Pre-loaded with 60+ exercises across 7 muscle groups:
Chest · Back · Shoulders · Arms · Core · Legs · Cardio
