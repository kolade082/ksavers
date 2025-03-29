import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList, Feature } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type OnboardingScreenProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

const features: Feature[] = [
  {
    id: '1',
    title: 'Smart Analysis',
    description: 'Upload your bank statement and get instant insights into your spending patterns.',
    icon: 'analytics',
  },
  {
    id: '2',
    title: 'Savings Tips',
    description: 'Receive personalized recommendations to help you save more money.',
    icon: 'savings',
  },
  {
    id: '3',
    title: 'Track Progress',
    description: 'Monitor your financial progress and see how your savings grow over time.',
    icon: 'trending-up',
  },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to KSavers</Text>
          <Text style={styles.subtitle}>Your personal finance companion</Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature) => (
            <View key={feature.id} style={styles.featureCard}>
              <MaterialIcons name={feature.icon as any} size={40} color="#2196F3" />
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  featuresContainer: {
    flex: 1,
    gap: 24,
  },
  featureCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: width - 48,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  getStartedButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen; 