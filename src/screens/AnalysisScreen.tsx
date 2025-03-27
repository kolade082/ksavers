import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for demonstration
const mockData = {
  categories: [
    { name: 'Food & Dining', amount: 450, icon: 'restaurant' },
    { name: 'Transportation', amount: 200, icon: 'directions-car' },
    { name: 'Shopping', amount: 300, icon: 'shopping-bag' },
    { name: 'Bills & Utilities', amount: 800, icon: 'receipt' },
    { name: 'Entertainment', amount: 150, icon: 'movie' },
    { name: 'Healthcare', amount: 250, icon: 'local-hospital' },
    { name: 'Education', amount: 400, icon: 'school' },
    { name: 'Travel', amount: 600, icon: 'flight' },
  ],
  totalSpending: 2750,
  totalIncome: 3500,
  netChange: 750,
  period: 'November 2024',
};

const CHART_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEEAD',
  '#D4A5A5',
  '#9B59B6',
  '#3498DB',
];

const CHART_CONFIG = {
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 1,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

export default function AnalysisScreen() {
  // Prepare data for bar chart
  const barChartData = {
    labels: mockData.categories.map(cat => cat.name),
    datasets: [{
      data: mockData.categories.map(cat => cat.amount),
      colors: CHART_COLORS.map(color => (opacity = 1) => color),
    }],
  };

  // Prepare data for line chart (weekly spending)
  const lineChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      data: [600, 800, 700, 650],
    }],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Spending</Text>
            <Text style={styles.summaryValue}>£{mockData.totalSpending}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Income</Text>
            <Text style={styles.summaryValue}>£{mockData.totalIncome}</Text>
          </View>
          <View style={[styles.summaryCard, styles.netChangeCard]}>
            <Text style={styles.summaryLabel}>Net Change</Text>
            <Text style={[styles.summaryValue, mockData.netChange >= 0 ? styles.positiveValue : styles.negativeValue]}>
              £{mockData.netChange}
            </Text>
          </View>
        </View>

        {/* Spending by Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          <View style={styles.barChartContainer}>
            <BarChart
              data={barChartData}
              width={Dimensions.get('window').width - 32}
              height={360}
              yAxisLabel="£"
              yAxisSuffix=""
              chartConfig={{
                ...CHART_CONFIG,
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                propsForLabels: {
                  fontSize: 10,
                  rotation: -45,
                  textAnchor: 'end',
                },
                barPercentage: 0.7,
                propsForBackgroundLines: {
                  strokeDasharray: '', // solid lines
                },
              }}
              style={styles.barChart}
              showBarTops={false}
              fromZero
              withInnerLines={true}
              withHorizontalLabels={true}
              withVerticalLabels={true}
              segments={4}
              withCustomBarColorFromData={true}
              flatColor={true}
              yAxisInterval={1}
            />
          </View>
        </View>

        {/* Weekly Spending Trend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Spending Trend</Text>
          <View style={styles.lineChartContainer}>
            <LineChart
              data={lineChartData}
              width={Dimensions.get('window').width - 48}
              height={220}
              chartConfig={{
                ...CHART_CONFIG,
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
              style={styles.lineChart}
            />
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          {mockData.categories.map((category, index) => (
            <View key={category.name} style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <MaterialIcons name={category.icon as any} size={24} color={CHART_COLORS[index]} />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryAmount}>£{category.amount}</Text>
              </View>
              <View style={[styles.categoryBar, { width: `${(category.amount / mockData.totalSpending) * 100}%`, backgroundColor: CHART_COLORS[index] }]} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  netChangeCard: {
    backgroundColor: '#e8f5e9',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  positiveValue: {
    color: '#2e7d32',
  },
  negativeValue: {
    color: '#c62828',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  barChartContainer: {
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    width: '100%',
  },
  barChart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  lineChartContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  lineChart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  categoryAmount: {
    fontSize: 14,
    color: '#666',
  },
  categoryBar: {
    height: 4,
    borderRadius: 2,
    marginLeft: 12,
  },
}); 