import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://your-api-endpoint.com';
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = await this.getAuthToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  // GPT-4 Vision for body analysis
  async analyzeBodyImage(imageUri: string, userInfo: any) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this body photo and provide a comprehensive fitness and nutrition plan. User info: Age ${userInfo.age}, Gender ${userInfo.gender}, Height ${userInfo.height}cm, Weight ${userInfo.currentWeight}kg, Goal: ${userInfo.goalType}, Activity Level: ${userInfo.activityLevel}. 

                  Please provide:
                  1. Estimated body fat percentage
                  2. Daily calorie target
                  3. Macro breakdown (protein, carbs, fat in grams)
                  4. Workout plan recommendation
                  5. Key areas to focus on
                  
                  Format the response as JSON with the following structure:
                  {
                    "bodyFatPercentage": number,
                    "dailyCalories": number,
                    "macros": {"protein": number, "carbs": number, "fat": number},
                    "workoutPlan": {"type": string, "frequency": number, "duration": number},
                    "focusAreas": [string],
                    "recommendations": [string]
                  }`
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUri,
                  },
                },
              ],
            },
          ],
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing body image:', error);
      throw error;
    }
  }

  // GPT-4 Chat for AI coaching
  async getChatResponse(message: string, context: any[] = []) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a professional fitness and nutrition coach. Provide helpful, accurate, and motivating advice about fitness, nutrition, and healthy lifestyle habits. Be encouraging and supportive while giving practical, actionable advice.',
            },
            ...context,
            {
              role: 'user',
              content: message,
            },
          ],
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error getting chat response:', error);
      throw error;
    }
  }

  // Analyze food image
  async analyzeFoodImage(imageUri: string) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyze this food image and provide nutritional information. Please identify the food items and estimate the calories, protein, carbs, and fat content. Format the response as JSON with the following structure: {"name": string, "calories": number, "protein": number, "carbs": number, "fat": number, "confidence": number}'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUri,
                  },
                },
              ],
            },
          ],
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze food image');
      }

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing food image:', error);
      throw error;
    }
  }

  // Barcode lookup
  async lookupBarcode(barcode: string) {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();
      
      if (data.status === 1) {
        const product = data.product;
        return {
          name: product.product_name || 'Unknown Product',
          calories: product.nutriments.energy_kcal_100g || 0,
          protein: product.nutriments.proteins_100g || 0,
          carbs: product.nutriments.carbohydrates_100g || 0,
          fat: product.nutriments.fat_100g || 0,
          verified: true,
        };
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('Error looking up barcode:', error);
      throw error;
    }
  }

  // User data endpoints
  async getUserProfile() {
    return this.request('/user/profile');
  }

  async updateUserProfile(updates: any) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async saveFoodEntry(entry: any) {
    return this.request('/food/entries', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  }

  async getDailyLog(date: string) {
    return this.request(`/food/daily-log?date=${date}`);
  }

  async saveBodyScan(scan: any) {
    return this.request('/body-scans', {
      method: 'POST',
      body: JSON.stringify(scan),
    });
  }

  async getBodyScans() {
    return this.request('/body-scans');
  }
}

export const apiService = new ApiService();