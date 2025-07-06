import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { CustomCard } from '@/components/CustomCard';
import { CustomButton } from '@/components/CustomButton';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { apiService } from '@/services/api';
import { Camera, Scan, Plus, Clock } from 'lucide-react-native';

export default function FoodScreen() {
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [todaysFoods, setTodaysFoods] = useState([
    {
      id: '1',
      name: 'Greek Yogurt with Berries',
      calories: 120,
      protein: 15,
      carbs: 12,
      fat: 2,
      time: '8:30 AM',
      verified: true,
    },
    {
      id: '2',
      name: 'Grilled Chicken Breast',
      calories: 185,
      protein: 35,
      carbs: 0,
      fat: 4,
      time: '12:45 PM',
      verified: true,
    },
  ]);

  const handlePhotoCapture = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Camera permission is required to capture food photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      await analyzeFoodImage(result.assets[0].uri);
    }
  };

  const handlePhotoUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Photo library permission is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      await analyzeFoodImage(result.assets[0].uri);
    }
  };

  const analyzeFoodImage = async (imageUri: string) => {
    setLoading(true);
    try {
      const analysis = await apiService.analyzeFoodImage(imageUri);
      
      const newFood = {
        id: Date.now().toString(),
        name: analysis.name,
        calories: analysis.calories,
        protein: analysis.protein,
        carbs: analysis.carbs,
        fat: analysis.fat,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        verified: analysis.confidence > 0.8,
        imageUrl: imageUri,
      };

      setTodaysFoods(prev => [...prev, newFood]);
      
      // Save to backend
      await apiService.saveFoodEntry(newFood);
      
      Alert.alert('Success', 'Food logged successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze food image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setShowScanner(false);
    setLoading(true);
    
    try {
      const foodData = await apiService.lookupBarcode(data);
      
      const newFood = {
        id: Date.now().toString(),
        ...foodData,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setTodaysFoods(prev => [...prev, newFood]);
      await apiService.saveFoodEntry(newFood);
      
      Alert.alert('Success', 'Food logged successfully!');
    } catch (error) {
      Alert.alert('Error', 'Product not found. Please try manual entry.');
    } finally {
      setLoading(false);
    }
  };

  const requestBarcodeScanPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    return status === 'granted';
  };

  const handleBarcodeScanner = async () => {
    const hasPermission = await requestBarcodeScanPermission();
    if (hasPermission) {
      setShowScanner(true);
    } else {
      Alert.alert('Permission Required', 'Camera permission is required to scan barcodes');
    }
  };

  const totalCalories = todaysFoods.reduce((sum, food) => sum + food.calories, 0);
  const totalProtein = todaysFoods.reduce((sum, food) => sum + food.protein, 0);
  const totalCarbs = todaysFoods.reduce((sum, food) => sum + food.carbs, 0);
  const totalFat = todaysFoods.reduce((sum, food) => sum + food.fat, 0);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Analyzing your food...</Text>
      </SafeAreaView>
    );
  }

  if (showScanner) {
    return (
      <SafeAreaView style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={handleBarcodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.scannerOverlay}>
          <Text style={styles.scannerText}>Scan the barcode on your food item</Text>
          <CustomButton
            title="Cancel"
            onPress={() => setShowScanner(false)}
            variant="outline"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Food Tracking</Text>
          <Text style={styles.subtitle}>Log your meals and track nutrition</Text>
        </View>

        {/* Daily Summary */}
        <CustomCard>
          <Text style={styles.cardTitle}>Today's Nutrition</Text>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{totalCalories}</Text>
              <Text style={styles.nutritionLabel}>Calories</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{totalProtein}g</Text>
              <Text style={styles.nutritionLabel}>Protein</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{totalCarbs}g</Text>
              <Text style={styles.nutritionLabel}>Carbs</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{totalFat}g</Text>
              <Text style={styles.nutritionLabel}>Fat</Text>
            </View>
          </View>
        </CustomCard>

        {/* Logging Options */}
        <CustomCard>
          <Text style={styles.cardTitle}>Add Food</Text>
          <View style={styles.loggingOptions}>
            <TouchableOpacity style={styles.loggingOption} onPress={handlePhotoCapture}>
              <Camera size={24} color="#10B981" />
              <Text style={styles.loggingOptionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.loggingOption} onPress={handlePhotoUpload}>
              <Plus size={24} color="#3B82F6" />
              <Text style={styles.loggingOptionText}>Upload Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.loggingOption} onPress={handleBarcodeScanner}>
              <Scan size={24} color="#8B5CF6" />
              <Text style={styles.loggingOptionText}>Scan Barcode</Text>
            </TouchableOpacity>
          </View>
        </CustomCard>

        {/* Food Log */}
        <CustomCard>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Today's Food Log</Text>
            <Clock size={20} color="#6B7280" />
          </View>
          
          {todaysFoods.length === 0 ? (
            <Text style={styles.emptyText}>No food logged yet today</Text>
          ) : (
            <View style={styles.foodList}>
              {todaysFoods.map((food) => (
                <View key={food.id} style={styles.foodItem}>
                  <View style={styles.foodItemHeader}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.foodTime}>{food.time}</Text>
                  </View>
                  <View style={styles.foodNutrition}>
                    <Text style={styles.foodCalories}>{food.calories} cal</Text>
                    <Text style={styles.foodMacros}>
                      P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                    </Text>
                  </View>
                  {food.verified && (
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedText}>AI Verified</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </CustomCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  loggingOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loggingOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  loggingOptionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  foodList: {
    gap: 16,
  },
  foodItem: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  foodItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  foodTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  foodNutrition: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  foodMacros: {
    fontSize: 12,
    color: '#6B7280',
  },
  verifiedBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#047857',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    paddingVertical: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    marginTop: 20,
  },
  scannerOverlay: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
    gap: 16,
  },
  scannerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    borderRadius: 8,
  },
});