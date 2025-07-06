avatar-Nutritions-AI-App


# 🥗 Nutrition AI App – Personalized Fitness & Meal Coach

A smart, AI-powered mobile app that generates fully personalized fitness and nutrition plans based on a user’s **body photo** and a **smart health questionnaire**.

Built with **React Native + Expo**, integrated with **GPT-4 Vision** and **GPT-4 Chat**, and deployed using **Bolt.new**.

---

## 🚀 Features

- 📷 **Body Scan with GPT-4 Vision** – Upload a body photo and get a detailed fitness plan and body fat estimate.
- 🧠 **Smart AI Onboarding** – Interactive form + image input generates a full calorie + meal + workout plan.
- 🍽️ **AI Food Logger** – Scan meals or barcodes to auto-log calories.
- 💬 **AI Coach Assistant** – GPT-powered chatbot for advice, motivation, and macro questions.
- 📊 **Tracking Dashboard** – View daily calories, meals, scan results, and progress.
- 👤 **User Profiles** – Manage account, preferences, and subscription.
- 💳 **In-App Subscriptions** – Monthly/annual plans with gated premium features.

---

## 🧠 Tech Stack

| Tech        | Purpose                                     |
|-------------|---------------------------------------------|
| React Native + Expo | Mobile app development (cross-platform)     |
| Bolt.new    | Low-code AI development + UI prototyping   |
| Supabase    | Auth + Database backend                    |
| OpenAI API  | GPT-4 Vision + Chat for AI interactions     |
| Open Food Facts | Barcode-based food data API            |
| Stripe / In-App Billing | Payment and subscriptions             |
| shadcn/ui   | UI components for consistent design system |

---

## 🛠️ Local Setup

> ⚠️ You must have Node.js, Expo CLI, and an OpenAI + Supabase account to run this project locally.

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/nutrition-ai-app.git
cd nutrition-ai-app

npm install
# or
yarn
Set Up Environment Variables
Create a .env file in the root and add the following:

env
Copy
Edit
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key


Start the App
bash
Copy
Edit
npx expo start
