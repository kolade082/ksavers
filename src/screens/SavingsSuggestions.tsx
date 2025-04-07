import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import ThemedView from '../components/ThemedView';
import ThemedText from '../components/ThemedText';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type SavingsSuggestionsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SavingsSuggestions'>;
};

// Mock data for demonstration
const mockSuggestions = [
  {
    id: '1',
    category: 'Groceries',
    title: 'Switch to a cheaper supermarket',
    description: 'You could save up to £50 per month by shopping at a more budget-friendly supermarket.',
    potentialSavings: '£50',
    difficulty: 'easy',
    timeframe: '1 month',
  },
  {
    id: '2',
    category: 'Transport',
    title: 'Consider public transport',
    description: 'Using public transport instead of driving could save you around £100 per month on fuel and parking.',
    potentialSavings: '£100',
    difficulty: 'medium',
    timeframe: '1 month',
  },
  {
    id: '3',
    category: 'Entertainment',
    title: 'Review subscription services',
    description: 'You have multiple streaming services. Consider canceling unused ones to save £30 per month.',
    potentialSavings: '£30',
    difficulty: 'easy',
    timeframe: '1 week',
  },
  {
    id: '4',
    category: 'Shopping',
    title: 'Use cashback apps',
    description: 'Using cashback apps for your regular purchases could earn you up to £20 per month.',
    potentialSavings: '£20',
    difficulty: 'easy',
    timeframe: '1 month',
  },
];

const SavingsSuggestions: React.FC<SavingsSuggestionsProps> = ({ navigation }) => {
  const { colors } = useTheme();

  React.useEffect(() => {
    console.log('SavingsSuggestions screen mounted');
    return () => {
      console.log('SavingsSuggestions screen unmounted');
    };
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return colors.success;
      case 'medium':
        return colors.warning;
      case 'hard':
        return colors.error;
      default:
        return colors.text;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <ThemedView useCard style={styles.header}>
          <View>
            <ThemedText variant="title">Savings Suggestions</ThemedText>
            <ThemedText variant="caption">Personalized tips to help you save more</ThemedText>
          </View>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        </ThemedView>

        {/* Summary Card */}
        <ThemedView useCard style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <MaterialIcons name="savings" size={24} color={colors.primary} />
            <ThemedText variant="subtitle">Monthly Savings Potential</ThemedText>
          </View>
          <ThemedText variant="title" style={{ color: colors.success, marginTop: 8 }}>
            £200
          </ThemedText>
          <ThemedText variant="caption" style={{ marginTop: 4 }}>
            By implementing all suggestions
          </ThemedText>
        </ThemedView>

        {/* Suggestions List */}
        <ThemedView useCard style={styles.suggestionsList}>
          {mockSuggestions.map((suggestion) => (
            <View 
              key={suggestion.id} 
              style={[styles.suggestionItem, { borderBottomColor: colors.border }]}
            >
              <View style={styles.suggestionHeader}>
                <View style={styles.categoryTag}>
                  <ThemedText variant="caption" style={{ color: colors.primary }}>
                    {suggestion.category}
                  </ThemedText>
                </View>
                <View style={[styles.difficultyTag, { backgroundColor: getDifficultyColor(suggestion.difficulty) }]}>
                  <ThemedText variant="caption" style={{ color: '#fff' }}>
                    {suggestion.difficulty}
                  </ThemedText>
                </View>
              </View>

              <ThemedText variant="subtitle" style={{ marginTop: 12 }}>
                {suggestion.title}
              </ThemedText>
              <ThemedText variant="body" style={{ marginTop: 4 }}>
                {suggestion.description}
              </ThemedText>

              <View style={styles.suggestionFooter}>
                <View style={styles.suggestionDetail}>
                  <MaterialIcons name="savings" size={16} color={colors.success} />
                  <ThemedText style={{ marginLeft: 4, color: colors.success }}>
                    Save {suggestion.potentialSavings}
                  </ThemedText>
                </View>
                <View style={styles.suggestionDetail}>
                  <MaterialIcons name="schedule" size={16} color={colors.text} />
                  <ThemedText style={{ marginLeft: 4 }}>
                    {suggestion.timeframe}
                  </ThemedText>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={() => {/* TODO: Implement action */}}
              >
                <MaterialIcons name="check-circle" size={20} color="#fff" />
                <ThemedText style={styles.actionButtonText}>Take Action</ThemedText>
              </TouchableOpacity>
            </View>
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
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  summaryCard: {
    margin: 20,
    padding: 20,
    alignItems: 'center',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionsList: {
    margin: 20,
    padding: 20,
  },
  suggestionItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  difficultyTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  suggestionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  suggestionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default SavingsSuggestions; 