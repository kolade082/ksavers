import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemedView from '../components/ThemedView';
import ThemedText from '../components/ThemedText';

interface HomeScreenProps {
  navigation: NavigationProp;
}

// Mock data for demonstration (keeping other mock data for now)
const mockData = {
  totalSavings: '£2,500',
  monthlyBudget: '£3,000',
  lastAnalysis: '2 days ago',
  recentActivity: [
    { type: 'analysis', date: '2 days ago', amount: '£2,750' },
    { type: 'suggestion', date: '3 days ago', title: 'Reduce Subscription Services' },
    { type: 'analysis', date: '1 week ago', amount: '£2,900' },
  ],
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { colors } = useTheme();
  
  // Extract first name from display name
  const firstName = user?.displayName?.split(' ')[0] || 'User';
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'analysis':
        return 'analytics';
      case 'suggestion':
        return 'lightbulb';
      default:
        return 'info';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'analysis':
        return colors.success;
      case 'suggestion':
        return colors.warning;
      default:
        return colors.info;
    }
  };

  const handleHistoryPress = () => {
    // console.log('Navigating to History screen');
    navigation.navigate('History');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container}>
        {/* Welcome Section */}
        <ThemedView useCard style={styles.welcomeSection}>
          <View>
            <ThemedText variant="caption">Welcome back,</ThemedText>
            <ThemedText variant="title">{firstName}</ThemedText>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleHistoryPress}
            >
              <MaterialIcons name="history" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <MaterialIcons name="account-circle" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </ThemedView>

        {/* Quick Stats */}
        <ThemedView useCard style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.background }]}>
            <MaterialIcons name="savings" size={24} color={colors.success} />
            <ThemedText variant="subtitle">{mockData.totalSavings}</ThemedText>
            <ThemedText variant="caption">Total Savings</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.background }]}>
            <MaterialIcons name="account-balance-wallet" size={24} color={colors.info} />
            <ThemedText variant="subtitle">{mockData.monthlyBudget}</ThemedText>
            <ThemedText variant="caption">Monthly Budget</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.background }]}>
            <MaterialIcons name="history" size={24} color={colors.warning} />
            <ThemedText variant="subtitle">{mockData.lastAnalysis}</ThemedText>
            <ThemedText variant="caption">Last Analysis</ThemedText>
          </View>
        </ThemedView>

        {/* Upload Button */}
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('UploadStatement')}
        >
          <View style={styles.uploadContent}>
            <MaterialIcons name="cloud-upload" size={32} color="#fff" />
            <ThemedText style={styles.uploadText}>Upload Bank Statement</ThemedText>
            <ThemedText style={styles.uploadSubtext}>
              Get personalized insights and savings tips
            </ThemedText>
          </View>
        </TouchableOpacity>

        {/* Recent Activity */}
        <ThemedView useCard style={styles.activitySection}>
          <ThemedText variant="subtitle">Recent Activity</ThemedText>
          {mockData.recentActivity.map((activity, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.activityItem, { borderBottomColor: colors.border }]}
              onPress={() => {
                if (activity.type === 'analysis') {
                  navigation.navigate('Analysis', { fileUri: 'mock-uri' });
                } else if (activity.type === 'suggestion') {
                  navigation.navigate('SavingsSuggestions');
                }
              }}
            >
              <View style={[styles.activityIcon, { backgroundColor: getActivityColor(activity.type) }]}>
                <MaterialIcons name={getActivityIcon(activity.type)} size={24} color="#fff" />
              </View>
              <View style={styles.activityInfo}>
                <ThemedText variant="body">
                  {activity.type === 'analysis' 
                    ? `Statement Analysis - ${activity.amount}`
                    : activity.title}
                </ThemedText>
                <ThemedText variant="caption">{activity.date}</ThemedText>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.text} />
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  uploadButton: {
    margin: 20,
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  activitySection: {
    padding: 20,
    marginTop: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
    marginLeft: 16,
  },
});

export default HomeScreen; 