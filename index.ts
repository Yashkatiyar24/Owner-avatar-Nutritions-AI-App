export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isPremium: boolean;
  createdAt: string;
}

export interface FitnessGoals {
  goalType: 'lose_weight' | 'gain_muscle' | 'maintain' | 'improve_fitness';
  targetWeight?: number;
  currentWeight: number;
  height: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  bodyFatPercentage?: number;
}

export interface NutritionPlan {
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  mealSuggestions: string[];
  restrictions: string[];
}

export interface WorkoutPlan {
  type: string;
  duration: number;
  frequency: number;
  exercises: Exercise[];
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  duration?: number;
  restTime: number;
  instructions: string;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  unit: string;
  timestamp: string;
  imageUrl?: string;
  verified: boolean;
}

export interface DailyLog {
  date: string;
  foods: FoodEntry[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  waterIntake: number;
  weight?: number;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  type: 'text' | 'image';
}

export interface BodyScan {
  id: string;
  imageUrl: string;
  date: string;
  bodyFatPercentage: number;
  muscleMass: number;
  analysis: string;
  recommendations: string[];
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
}