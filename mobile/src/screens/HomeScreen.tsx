import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const features = [
    {
      icon: 'camera',
      title: 'Quick Scan',
      description: 'Instantly analyze items with your camera',
      onPress: () => navigation.navigate('Camera' as never),
    },
    {
      icon: 'images',
      title: 'Upload Photo',
      description: 'Select from your photo library',
      onPress: () => navigation.navigate('Camera' as never),
    },
    {
      icon: 'time',
      title: 'Recent Scans',
      description: 'View your analysis history',
      onPress: () => navigation.navigate('History' as never),
    },
    {
      icon: 'star',
      title: 'Saved Items',
      description: 'Access your favorite analyses',
      onPress: () => navigation.navigate('Saved' as never),
    },
  ];

  const stats = [
    { label: 'Total Scans', value: '28' },
    { label: 'Saved Items', value: '5' },
    { label: 'This Month', value: '12' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.appTitle}>Snap2Cash</Text>
          <Text style={styles.subtitle}>
            Discover the value of your items instantly
          </Text>
        </View>
      </LinearGradient>

      {/* Stats */}
      <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stat.value}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Features */}
      <View style={styles.featuresContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Quick Actions
        </Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.featureCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={feature.onPress}
            >
              <View style={[styles.featureIcon, { backgroundColor: colors.primary }]}>
                <Ionicons
                  name={feature.icon as any}
                  size={24}
                  color="white"
                />
              </View>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                {feature.title}
              </Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                {feature.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.recentContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recent Activity
        </Text>
        {['Vintage Lamp Scan', 'Old Book Valuation', 'Sneaker Price Check'].map(
          (item, index) => (
            <View
              key={index}
              style={[
                styles.recentItem,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <View style={styles.recentItemContent}>
                <Text style={[styles.recentItemTitle, { color: colors.text }]}>
                  {item}
                </Text>
                <Text style={[styles.recentItemDate, { color: colors.textSecondary }]}>
                  2 days ago
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </View>
          )
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
  },
  appTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  featuresContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  recentContainer: {
    padding: 20,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  recentItemContent: {
    flex: 1,
  },
  recentItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  recentItemDate: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default HomeScreen;