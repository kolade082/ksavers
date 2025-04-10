import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import ThemedView from '../components/ThemedView';
import ThemedText from '../components/ThemedText';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Mock data for demonstration
const mockAnalysis = {
  totalSpent: '£2,500',
  totalSaved: '£500',
  savingsRate: '16.7%',
  categories: [
    { name: 'Groceries', amount: '£800', percentage: 32 },
    { name: 'Transport', amount: '£400', percentage: 16 },
    { name: 'Entertainment', amount: '£300', percentage: 12 },
    { name: 'Utilities', amount: '£250', percentage: 10 },
    { name: 'Shopping', amount: '£750', percentage: 30 },
  ],
  insights: [
    {
      title: 'High Grocery Spending',
      description: 'Your grocery spending is 20% higher than the average for your income bracket.',
      type: 'warning',
    },
    {
      title: 'Good Savings Rate',
      description: 'You\'re saving more than 15% of your income, which is above the recommended rate.',
      type: 'success',
    },
    {
      title: 'Shopping Habits',
      description: 'Consider reviewing your shopping expenses, as they make up a significant portion of your budget.',
      type: 'info',
    },
  ],
};

// Add this type
type AnalysisScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Analysis'>;

const AnalysisScreen = () => {
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const navigation = useNavigation<AnalysisScreenNavigationProp>();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'info':
        return colors.info;
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
            <ThemedText variant="title">Analysis Results</ThemedText>
            <ThemedText variant="caption">Based on your bank statement</ThemedText>
          </View>
          <TouchableOpacity style={styles.shareButton}>
            <MaterialIcons name="share" size={24} color={colors.primary} />
          </TouchableOpacity>
        </ThemedView>

        {/* Summary Cards */}
        <ThemedView useCard style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { backgroundColor: colors.background }]}>
            <MaterialIcons name="account-balance-wallet" size={24} color={colors.primary} />
            <ThemedText variant="subtitle">{mockAnalysis.totalSpent}</ThemedText>
            <ThemedText variant="caption">Total Spent</ThemedText>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.background }]}>
            <MaterialIcons name="savings" size={24} color={colors.success} />
            <ThemedText variant="subtitle">{mockAnalysis.totalSaved}</ThemedText>
            <ThemedText variant="caption">Total Saved</ThemedText>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.background }]}>
            <MaterialIcons name="trending-up" size={24} color={colors.info} />
            <ThemedText variant="subtitle">{mockAnalysis.savingsRate}</ThemedText>
            <ThemedText variant="caption">Savings Rate</ThemedText>
          </View>
        </ThemedView>

        {/* Spending Categories */}
        <ThemedView useCard style={styles.section}>
          <ThemedText variant="subtitle">Spending Categories</ThemedText>
          {mockAnalysis.categories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <ThemedText>{category.name}</ThemedText>
                <ThemedText>{category.amount}</ThemedText>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${category.percentage}%`,
                      backgroundColor: colors.primary,
                    }
                  ]} 
                />
              </View>
              <ThemedText variant="caption">{category.percentage}% of total</ThemedText>
            </View>
          ))}
        </ThemedView>

        {/* Insights */}
        <ThemedView useCard style={styles.section}>
          <ThemedText variant="subtitle">Insights</ThemedText>
          {mockAnalysis.insights.map((insight, index) => (
            <View key={index} style={styles.insightItem}>
              <MaterialIcons 
                name={getInsightIcon(insight.type)} 
                size={24} 
                color={getInsightColor(insight.type)} 
              />
              <View style={styles.insightContent}>
                <ThemedText variant="body" style={{ fontWeight: '600' }}>
                  {insight.title}
                </ThemedText>
                <ThemedText variant="caption">{insight.description}</ThemedText>
              </View>
            </View>
          ))}
        </ThemedView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => {/* TODO: Implement save PDF */}}
          >
            <MaterialIcons name="picture-as-pdf" size={24} color="#fff" />
            <ThemedText style={styles.actionButtonText}>Save as PDF</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.success }]}
            onPress={() => {
              console.log('Navigating to SavingsSuggestions from AnalysisScreen...');
              navigation.navigate('SavingsSuggestions');
            }}
          >
            <MaterialIcons name="lightbulb" size={24} color="#fff" />
            <ThemedText style={styles.actionButtonText}>View Savings Tips</ThemedText>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  shareButton: {
    padding: 8,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  section: {
    padding: 20,
    marginTop: 20,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  insightContent: {
    flex: 1,
    marginLeft: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default AnalysisScreen; 