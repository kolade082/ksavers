import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '../types/navigation';

interface HomeScreenProps {
  navigation: NavigationProp;
}

// Mock data for demonstration
const mockData = {
  userName: 'John',
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
        return '#4CAF50';
      case 'suggestion':
        return '#FFC107';
      default:
        return '#2196F3';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{mockData.userName}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <MaterialIcons name="account-circle" size={40} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialIcons name="savings" size={24} color="#4CAF50" />
            <Text style={styles.statValue}>{mockData.totalSavings}</Text>
            <Text style={styles.statLabel}>Total Savings</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="account-balance-wallet" size={24} color="#2196F3" />
            <Text style={styles.statValue}>{mockData.monthlyBudget}</Text>
            <Text style={styles.statLabel}>Monthly Budget</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="history" size={24} color="#FF9800" />
            <Text style={styles.statValue}>{mockData.lastAnalysis}</Text>
            <Text style={styles.statLabel}>Last Analysis</Text>
          </View>
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => navigation.navigate('UploadStatement')}
        >
          <View style={styles.uploadContent}>
            <MaterialIcons name="cloud-upload" size={32} color="#fff" />
            <Text style={styles.uploadText}>Upload Bank Statement</Text>
            <Text style={styles.uploadSubtext}>
              Get personalized insights and savings tips
            </Text>
          </View>
        </TouchableOpacity>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {mockData.recentActivity.map((activity, index) => (
            <TouchableOpacity
              key={index}
              style={styles.activityItem}
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
                <Text style={styles.activityTitle}>
                  {activity.type === 'analysis' 
                    ? `Statement Analysis - ${activity.amount}`
                    : activity.title}
                </Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  uploadButton: {
    margin: 20,
    backgroundColor: '#4CAF50',
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
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen; 