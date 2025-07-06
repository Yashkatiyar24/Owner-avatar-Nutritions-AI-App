import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { CustomButton } from '@/components/CustomButton';
import { CustomCard } from '@/components/CustomCard';
import { apiService } from '@/services/api';
import { FitnessGoals } from '@/types';
import { Camera, Upload } from 'lucide-react-native';

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [bodyImage, setBodyImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fitnessGoals, setFitnessGoals] = useState<Partial<FitnessGoals>>({});

  const totalSteps = 3;

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to continue');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setBodyImage(result.assets[0].uri);
    }
  };

  const handleCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please grant camera permissions to continue');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setBodyImage(result.assets[0].uri);
    }
  };

  const handleGoalSelection = (goal: string) => {
    setFitnessGoals(prev => ({ ...prev, goalType: goal as any }));
  };

  const handleActivityLevel = (level: string) => {
    setFitnessGoals(prev => ({ ...prev, activityLevel: level as any }));
  };

  const handleComplete = async () => {
    if (!bodyImage || !fitnessGoals.goalType || !fitnessGoals.activityLevel) {
      Alert.alert('Error', 'Please complete all steps');
      return;
    }

    setLoading(true);
    try {
      const analysisResult = await apiService.analyzeBodyImage(bodyImage, fitnessGoals);
      
      // Save the analysis result to user profile
      await apiService.updateUserProfile({
        fitnessGoals,
        aiAnalysis: analysisResult,
        onboardingCompleted: true,
      });

      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Upload Your Body Photo</Text>
      <Text style={styles.stepSubtitle}>
        Our AI will analyze your photo to create a personalized fitness and nutrition plan
      </Text>

      {bodyImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: bodyImage }} style={styles.bodyImage} />
          <TouchableOpacity 
            style={styles.retakeButton}
            onPress={() => setBodyImage(null)}
          >
            <Text style={styles.retakeText}>Retake Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CustomCard>
          <View style={styles.uploadOptions}>
            <TouchableOpacity style={styles.uploadOption} onPress={handleCamera}>
              <Camera size={32} color="#10B981" />
              <Text style={styles.uploadOptionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.uploadOption} onPress={handleImagePicker}>
              <Upload size={32} color="#10B981" />
              <Text style={styles.uploadOptionText}>Upload from Gallery</Text>
            </TouchableOpacity>
          </View>
        </CustomCard>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's Your Goal?</Text>
      <Text style={styles.stepSubtitle}>
        Choose your primary fitness objective
      </Text>

      <View style={styles.optionsContainer}>
        {[
          { key: 'lose_weight', label: 'Lose Weight', desc: 'Burn fat and get leaner' },
          { key: 'gain_muscle', label: 'Gain Muscle', desc: 'Build strength and mass' },
          { key: 'maintain', label: 'Maintain', desc: 'Stay healthy and fit' },
          { key: 'improve_fitness', label: 'Improve Fitness', desc: 'Boost overall health' },
        ].map((goal) => (
          <TouchableOpacity
            key={goal.key}
            style={[
              styles.optionCard,
              fitnessGoals.goalType === goal.key && styles.selectedOption
            ]}
            onPress={() => handleGoalSelection(goal.key)}
          >
            <Text style={[
              styles.optionLabel,
              fitnessGoals.goalType === goal.key && styles.selectedOptionText
            ]}>
              {goal.label}
            </Text>
            <Text style={[
              styles.optionDesc,
              fitnessGoals.goalType === goal.key && styles.selectedOptionDesc
            ]}>
              {goal.desc}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Activity Level</Text>
      <Text style={styles.stepSubtitle}>
        How active are you currently?
      </Text>

      <View style={styles.optionsContainer}>
        {[
          { key: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
          { key: 'lightly_active', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
          { key: 'moderately_active', label: 'Moderately Active', desc: 'Exercise 3-5 days/week' },
          { key: 'very_active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
          { key: 'extra_active', label: 'Extra Active', desc: 'Very hard exercise, training 2x/day' },
        ].map((level) => (
          <TouchableOpacity
            key={level.key}
            style={[
              styles.optionCard,
              fitnessGoals.activityLevel === level.key && styles.selectedOption
            ]}
            onPress={() => handleActivityLevel(level.key)}
          >
            <Text style={[
              styles.optionLabel,
              fitnessGoals.activityLevel === level.key && styles.selectedOptionText
            ]}>
              {level.label}
            </Text>
            <Text style={[
              styles.optionDesc,
              fitnessGoals.activityLevel === level.key && styles.selectedOptionDesc
            ]}>
              {level.desc}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!bodyImage;
      case 2:
        return !!fitnessGoals.goalType;
      case 3:
        return !!fitnessGoals.activityLevel;
      default:
        return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress Bar */}
        <View style={styles.progressBar}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressStep,
                index < step ? styles.progressStepCompleted : styles.progressStepInactive
              ]}
            />
          ))}
        </View>

        <Text style={styles.stepNumber}>Step {step} of {totalSteps}</Text>

        {renderCurrentStep()}

        <View style={styles.buttonContainer}>
          {step > 1 && (
            <CustomButton
              title="Previous"
              onPress={() => setStep(step - 1)}
              variant="outline"
              size="large"
            />
          )}
          
          {step < totalSteps ? (
            <CustomButton
              title="Next"
              onPress={() => setStep(step + 1)}
              disabled={!canProceed()}
              size="large"
            />
          ) : (
            <CustomButton
              title="Complete Setup"
              onPress={handleComplete}
              disabled={!canProceed()}
              loading={loading}
              size="large"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  progressBar: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  progressStep: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  progressStepCompleted: {
    backgroundColor: '#10B981',
  },
  progressStepInactive: {
    backgroundColor: '#E5E7EB',
  },
  stepNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  stepContainer: {
    flex: 1,
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
    lineHeight: 24,
  },
  imageContainer: {
    alignItems: 'center',
    gap: 16,
  },
  bodyImage: {
    width: 200,
    height: 260,
    borderRadius: 12,
  },
  retakeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  retakeText: {
    color: '#374151',
    fontWeight: '500',
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  uploadOption: {
    alignItems: 'center',
    gap: 12,
  },
  uploadOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  selectedOptionText: {
    color: '#047857',
  },
  optionDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedOptionDesc: {
    color: '#059669',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
  },
});