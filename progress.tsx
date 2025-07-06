import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomCard } from '@/components/CustomCard';
import { TrendingUp, Calendar, Target, Zap, Camera } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  
  const progressData = {
    week: {
      weight: [70.5, 70.2, 70.0, 69.8, 69.5, 69.3, 69.1],
      calories: [2200, 2150, 2300, 2100, 2250, 2180, 2200],
      workouts: [1, 0, 1, 1, 0, 1, 1],
    },
    month: {
      weight: [71.0, 70.5, 70.2, 69.8, 69.5, 69.3, 69.1, 68.9],
      calories: [2180, 2200, 2150, 2100, 2250, 2180, 2200, 2150],
      workouts: [5, 4, 6, 5, 4, 5, 5, 6],
    },
  };

  const bodyScans = [
    {
      id: '1',
      date: '2024-01-01',
      bodyFat: 15.2,
      muscleMass: 42.5,
      changes: 'Lost 2.3% body fat',
    },
    {
      id: '2',
      date: '2024-01-15',
      bodyFat: 14.8,
      muscleMass: 43.1,
      changes: 'Gained 0.6kg muscle',
    },
  ];

  const achievements = [
    {
      id: '1',
      title: '7 Day Streak',
      description: 'Logged food for 7 consecutive days',
      icon: '🔥',
      completed: true,
    },
    {
      id: '2',
      title: 'Protein Goal',
      description: 'Hit protein target 5 days this week',
      icon: '💪',
      completed: true,
    },
    {
      id: '3',
      title: 'Workout Warrior',
      description: 'Complete 10 workouts this month',
      icon: '🏋️',
      completed: false,
      progress: 7,
      target: 10,
    },
  ];

  const renderProgressChart = () => {
    const data = progressData[selectedPeriod as keyof typeof progressData];
    const maxWeight = Math.max(...data.weight);
    const minWeight = Math.min(...data.weight);
    const weightRange = maxWeight - minWeight;
    
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Weight Progress</Text>
          <View style={styles.periodSelector}>
            {['week', 'month'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodText,
                  selectedPeriod === period && styles.periodTextActive
                ]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.chart}>
          <View style={styles.chartLine}>
            {data.weight.map((weight, index) => (
              <View
                key={index}
                style={[
                  styles.chartPoint,
                  {
                    left: (index / (data.weight.length - 1)) * (width - 80),
                    bottom: weightRange > 0 ? ((weight - minWeight) / weightRange) * 100 : 50,
                  }
                ]}
              />
            ))}
          </View>
          <View style={styles.chartLabels}>
            <Text style={styles.chartLabel}>{minWeight}kg</Text>
            <Text style={styles.chartLabel}>{maxWeight}kg</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Progress Tracking</Text>
          <Text style={styles.subtitle}>Monitor your fitness journey</Text>
        </View>

        {/* Progress Chart */}
        <CustomCard>
          {renderProgressChart()}
        </CustomCard>

        {/* Quick Stats */}
        <CustomCard>
          <Text style={styles.cardTitle}>This Week</Text>
          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <View style={styles.statIcon}>
                <TrendingUp size={20} color="#10B981" />
              </View>
              <Text style={styles.statValue}>-1.4kg</Text>
              <Text style={styles.statLabel}>Weight Lost</Text>
            </View>
            <View style={styles.quickStat}>
              <View style={styles.statIcon}>
                <Target size={20} color="#3B82F6" />
              </View>
              <Text style={styles.statValue}>95%</Text>
              <Text style={styles.statLabel}>Goal Achievement</Text>
            </View>
            <View style={styles.quickStat}>
              <View style={styles.statIcon}>
                <Zap size={20} color="#F59E0B" />
              </View>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
          </View>
        </CustomCard>

        {/* Body Scans */}
        <CustomCard>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Body Scans</Text>
            <TouchableOpacity style={styles.addButton}>
              <Camera size={20} color="#10B981" />
              <Text style={styles.addButtonText}>New Scan</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.scansList}>
            {bodyScans.map((scan) => (
              <View key={scan.id} style={styles.scanItem}>
                <View style={styles.scanDate}>
                  <Calendar size={16} color="#6B7280" />
                  <Text style={styles.scanDateText}>
                    {new Date(scan.date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.scanStats}>
                  <View style={styles.scanStat}>
                    <Text style={styles.scanStatValue}>{scan.bodyFat}%</Text>
                    <Text style={styles.scanStatLabel}>Body Fat</Text>
                  </View>
                  <View style={styles.scanStat}>
                    <Text style={styles.scanStatValue}>{scan.muscleMass}kg</Text>
                    <Text style={styles.scanStatLabel}>Muscle Mass</Text>
                  </View>
                </View>
                <Text style={styles.scanChanges}>{scan.changes}</Text>
              </View>
            ))}
          </View>
        </CustomCard>

        {/* Achievements */}
        <CustomCard>
          <Text style={styles.cardTitle}>Achievements</Text>
          <View style={styles.achievementsList}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementItem}>
                <View style={styles.achievementIcon}>
                  <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
                </View>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  {!achievement.completed && achievement.progress && (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill,
                            { width: `${(achievement.progress / achievement.target!) * 100}%` }
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {achievement.progress}/{achievement.target}
                      </Text>
                    </View>
                  )}
                </View>
                {achievement.completed && (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedText}>✓</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
  },
  chartContainer: {
    height: 200,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  periodText: {
    fontSize: 14,
    color: '#6B7280',
  },
  periodTextActive: {
    color: '#1F2937',
    fontWeight: '500',
  },
  chart: {
    flex: 1,
    position: 'relative',
  },
  chartLine: {
    flex: 1,
    position: 'relative',
  },
  chartPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#10B981',
    borderRadius: 4,
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickStat: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  scansList: {
    gap: 16,
  },
  scanItem: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  scanDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  scanDateText: {
    fontSize: 14,
    color: '#6B7280',
  },
  scanStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scanStat: {
    alignItems: 'center',
  },
  scanStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  scanStatLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  scanChanges: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  achievementsList: {
    gap: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementEmoji: {
    fontSize: 20,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  completedBadge: {
    width: 24,
    height: 24,
    backgroundColor: '#10B981',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});