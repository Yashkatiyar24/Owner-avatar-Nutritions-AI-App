import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { CustomCard } from '@/components/CustomCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Camera, Target, Zap, TrendingUp, Clock, Calendar } from 'lucide-react-native';

export default function HomeScreen() {
  const { user, loading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [dailyStats, setDailyStats] = useState({
    caloriesConsumed: 1420,
    caloriesTarget: 2200,
    proteinConsumed: 89,
    proteinTarget: 120,
    workoutsThisWeek: 3,
    workoutsTarget: 5,
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/(auth)/login');
    }
  }, [user, loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  const caloriesRemaining = dailyStats.caloriesTarget - dailyStats.caloriesConsumed;
  const proteinRemaining = dailyStats.proteinTarget - dailyStats.proteinConsumed;
  const caloriesProgress = (dailyStats.caloriesConsumed / dailyStats.caloriesTarget) * 100;
  const proteinProgress = (dailyStats.proteinConsumed / dailyStats.proteinTarget) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          <TouchableOpacity style={styles.streakContainer}>
            <Zap size={20} color="#F59E0B" />
            <Text style={styles.streakText}>7 day streak</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/(tabs)/food')}
          >
            <Camera size={24} color="#10B981" />
            <Text style={styles.quickActionText}>Log Food</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/(tabs)/progress')}
          >
            <TrendingUp size={24} color="#3B82F6" />
            <Text style={styles.quickActionText}>Progress</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/(tabs)/coach')}
          >
            <Target size={24} color="#8B5CF6" />
            <Text style={styles.quickActionText}>AI Coach</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Overview */}
        <CustomCard>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Today's Overview</Text>
            <Calendar size={20} color="#6B7280" />
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Calories</Text>
              <Text style={styles.statValue}>
                {dailyStats.caloriesConsumed} / {dailyStats.caloriesTarget}
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.min(caloriesProgress, 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.remainingText}>
                {caloriesRemaining > 0 ? `${caloriesRemaining} remaining` : 'Target reached!'}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Protein</Text>
              <Text style={styles.statValue}>
                {dailyStats.proteinConsumed}g / {dailyStats.proteinTarget}g
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.min(proteinProgress, 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.remainingText}>
                {proteinRemaining > 0 ? `${proteinRemaining}g remaining` : 'Target reached!'}
              </Text>
            </View>
          </View>
        </CustomCard>

        {/* Weekly Progress */}
        <CustomCard>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Weekly Progress</Text>
            <TrendingUp size={20} color="#6B7280" />
          </View>
          
          <View style={styles.weeklyStats}>
            <View style={styles.weeklyStatItem}>
              <Text style={styles.weeklyStatNumber}>
                {dailyStats.workoutsThisWeek}
              </Text>
              <Text style={styles.weeklyStatLabel}>Workouts</Text>
            </View>
            <View style={styles.weeklyStatItem}>
              <Text style={styles.weeklyStatNumber}>5</Text>
              <Text style={styles.weeklyStatLabel}>Days Logged</Text>
            </View>
            <View style={styles.weeklyStatItem}>
              <Text style={styles.weeklyStatNumber}>95%</Text>
              <Text style={styles.weeklyStatLabel}>Goal Achievement</Text>
            </View>
          </View>
        </CustomCard>

        {/* AI Insights */}
        <CustomCard>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>AI Insights</Text>
            <Zap size={20} color="#F59E0B" />
          </View>
          
          <View style={styles.insights}>
            <View style={styles.insightItem}>
              <View style={styles.insightIcon}>
                <Target size={16} color="#10B981" />
              </View>
              <Text style={styles.insightText}>
                You're doing great! Try adding more protein to reach your daily goal.
              </Text>
            </View>
            <View style={styles.insightItem}>
              <View style={styles.insightIcon}>
                <Clock size={16} color="#3B82F6" />
              </View>
              <Text style={styles.insightText}>
                Your most productive workout time is between 6-8 PM based on your logs.
              </Text>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  streakText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  statsContainer: {
    gap: 20,
  },
  statItem: {
    gap: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  remainingText: {
    fontSize: 12,
    color: '#6B7280',
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weeklyStatItem: {
    alignItems: 'center',
  },
  weeklyStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
  },
  weeklyStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  insights: {
    gap: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  insightIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});