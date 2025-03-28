import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  potentialSavings: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  category: 'spending' | 'investment' | 'budgeting';
}

const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    title: 'Reduce Subscription Services',
    description: 'You have 5 active subscriptions. Consider reviewing and canceling unused ones.',
    potentialSavings: '$50/month',
    icon: 'subscriptions',
    category: 'spending'
  },
  {
    id: '2',
    title: 'Energy Efficiency',
    description: 'Your electricity bill is 20% higher than average. Consider switching to LED bulbs.',
    potentialSavings: '$30/month',
    icon: 'lightbulb',
    category: 'spending'
  },
  {
    id: '3',
    title: 'Emergency Fund',
    description: 'Start building an emergency fund with 3-6 months of expenses.',
    potentialSavings: '$1000',
    icon: 'savings',
    category: 'investment'
  },
  {
    id: '4',
    title: 'Meal Planning',
    description: 'Plan your meals to reduce food waste and takeout expenses.',
    potentialSavings: '$200/month',
    icon: 'restaurant',
    category: 'budgeting'
  }
];

const SavingsSuggestionsScreen = () => {
  const getCategoryColor = (category: Suggestion['category']) => {
    switch (category) {
      case 'spending':
        return '#FF6B6B';
      case 'investment':
        return '#4ECDC4';
      case 'budgeting':
        return '#45B7D1';
      default:
        return '#666';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Savings Suggestions</Text>
          <Text style={styles.subtitle}>Personalized tips to help you save more</Text>
        </View>

        <View style={styles.suggestionsContainer}>
          {mockSuggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion.id}
              style={styles.suggestionCard}
              activeOpacity={0.7}
            >
              <View style={styles.suggestionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: getCategoryColor(suggestion.category) }]}>
                  <MaterialIcons name={suggestion.icon} size={24} color="#fff" />
                </View>
                <View style={styles.suggestionTitleContainer}>
                  <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                  <Text style={styles.suggestionCategory}>
                    {suggestion.category.charAt(0).toUpperCase() + suggestion.category.slice(1)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
              
              <View style={styles.savingsContainer}>
                <MaterialIcons name="savings" size={16} color="#4CAF50" />
                <Text style={styles.potentialSavings}>
                  Potential Savings: {suggestion.potentialSavings}
                </Text>
              </View>
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  suggestionsContainer: {
    padding: 16,
  },
  suggestionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionTitleContainer: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  suggestionCategory: {
    fontSize: 14,
    color: '#666',
  },
  suggestionDescription: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 12,
  },
  savingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 8,
    borderRadius: 8,
  },
  potentialSavings: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
});

export default SavingsSuggestionsScreen; 