import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { CustomCard } from '@/components/CustomCard';
import { CustomButton } from '@/components/CustomButton';
import { User, Settings, Crown, Bell, Shield, CircleHelp as HelpCircle, LogOut, Star, Gift } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await logout();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const subscriptionTiers = [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      interval: 'free',
      features: [
        'Basic food logging',
        'Simple progress tracking',
        'Limited AI coach responses',
      ],
      current: !user?.isPremium,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      interval: 'monthly',
      features: [
        'Advanced AI analysis',
        'Unlimited coach conversations',
        'Body scan comparisons',
        'Custom meal planning',
        'Priority support',
      ],
      current: user?.isPremium,
      popular: true,
    },
    {
      id: 'premium-yearly',
      name: 'Premium Yearly',
      price: 99.99,
      interval: 'yearly',
      features: [
        'All Premium features',
        '2 months free',
        'Advanced analytics',
        'Personalized coaching',
      ],
      current: false,
    },
  ];

  const profileStats = [
    { label: 'Days Active', value: '23', color: '#10B981' },
    { label: 'Foods Logged', value: '156', color: '#3B82F6' },
    { label: 'Workouts', value: '18', color: '#8B5CF6' },
    { label: 'Streak', value: '7', color: '#F59E0B' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <CustomCard>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <User size={32} color="#10B981" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.subscriptionBadge}>
                <Crown size={16} color={user?.isPremium ? '#F59E0B' : '#6B7280'} />
                <Text style={[
                  styles.subscriptionText,
                  user?.isPremium && styles.premiumText
                ]}>
                  {user?.isPremium ? 'Premium' : 'Basic'}
                </Text>
              </View>
            </View>
          </View>
        </CustomCard>

        {/* Stats */}
        <CustomCard>
          <Text style={styles.cardTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            {profileStats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={[styles.statValue, { color: stat.color }]}>
                  {stat.value}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </CustomCard>

        {/* Subscription Plans */}
        <CustomCard>
          <Text style={styles.cardTitle}>Subscription Plans</Text>
          <View style={styles.subscriptionPlans}>
            {subscriptionTiers.map((tier) => (
              <View
                key={tier.id}
                style={[
                  styles.subscriptionTier,
                  tier.current && styles.currentTier,
                  tier.popular && styles.popularTier
                ]}
              >
                {tier.popular && (
                  <View style={styles.popularBadge}>
                    <Star size={12} color="#FFFFFF" />
                    <Text style={styles.popularText}>Popular</Text>
                  </View>
                )}
                
                <Text style={styles.tierName}>{tier.name}</Text>
                <View style={styles.tierPrice}>
                  <Text style={styles.priceAmount}>
                    ${tier.price}
                  </Text>
                  <Text style={styles.priceInterval}>
                    {tier.interval === 'free' ? '' : `/${tier.interval}`}
                  </Text>
                </View>
                
                <View style={styles.tierFeatures}>
                  {tier.features.map((feature, index) => (
                    <Text key={index} style={styles.featureText}>
                      • {feature}
                    </Text>
                  ))}
                </View>
                
                {!tier.current && (
                  <CustomButton
                    title={tier.price === 0 ? 'Downgrade' : 'Upgrade'}
                    onPress={() => {
                      if (tier.price > 0) {
                        Alert.alert('Upgrade', 'Subscription management coming soon!');
                      }
                    }}
                    variant={tier.price === 0 ? 'outline' : 'primary'}
                    size="medium"
                  />
                )}
                
                {tier.current && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentText}>Current Plan</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </CustomCard>

        {/* Settings */}
        <CustomCard>
          <Text style={styles.cardTitle}>Settings</Text>
          <View style={styles.settingsOptions}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Settings size={20} color="#6B7280" />
              </View>
              <Text style={styles.settingText}>Account Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Bell size={20} color="#6B7280" />
              </View>
              <Text style={styles.settingText}>Notifications</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Shield size={20} color="#6B7280" />
              </View>
              <Text style={styles.settingText}>Privacy & Security</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Gift size={20} color="#6B7280" />
              </View>
              <Text style={styles.settingText}>Referral Program</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <HelpCircle size={20} color="#6B7280" />
              </View>
              <Text style={styles.settingText}>Help & Support</Text>
            </TouchableOpacity>
          </View>
        </CustomCard>

        {/* Logout */}
        <CustomCard>
          <CustomButton
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            size="large"
            loading={loading}
          />
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: '#F0FDF4',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  subscriptionText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  premiumText: {
    color: '#F59E0B',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  subscriptionPlans: {
    gap: 16,
  },
  subscriptionTier: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  currentTier: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  popularTier: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  tierName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  tierPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  priceInterval: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  tierFeatures: {
    marginBottom: 16,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  currentBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  currentText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  settingsOptions: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#374151',
  },
});