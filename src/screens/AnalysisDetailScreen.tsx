import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BarChart } from 'react-native-chart-kit';

type AnalysisDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'AnalysisDetail'>;

// Mock data for detailed analysis
const mockAnalysisDetail = {
  id: '1',
  date: '2024-03-15',
  time: '14:30',
  fileName: 'Statement_March_2024.pdf',
  totalSpending: 2500,
  totalIncome: 3500,
  savings: 1000,
  categories: [
    { name: 'Food', amount: 800, color: '#FF6B6B' },
    { name: 'Transport', amount: 500, color: '#4ECDC4' },
    { name: 'Entertainment', amount: 400, color: '#45B7D1' },
    { name: 'Bills', amount: 500, color: '#96CEB4' },
    { name: 'Shopping', amount: 300, color: '#FFEEAD' },
  ],
  transactions: [
    { date: '2024-03-15', description: 'Grocery Shopping', amount: -150, category: 'Food' },
    { date: '2024-03-14', description: 'Bus Ticket', amount: -25, category: 'Transport' },
    { date: '2024-03-14', description: 'Movie Tickets', amount: -80, category: 'Entertainment' },
    { date: '2024-03-13', description: 'Utility Bill', amount: -200, category: 'Bills' },
    { date: '2024-03-13', description: 'Clothing Store', amount: -120, category: 'Shopping' },
  ],
};

const AnalysisDetailScreen: React.FC<AnalysisDetailScreenProps> = ({ navigation, route }) => {
  const { analysisId } = route.params;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const chartData = {
    labels: mockAnalysisDetail.categories.map(cat => cat.name),
    datasets: [{
      data: mockAnalysisDetail.categories.map(cat => cat.amount),
    }],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Details</Text>
      </View>

      <ScrollView style={styles.container}>
        {/* Summary Section */}
        <View style={styles.summaryCard}>
          <Text style={styles.fileName}>{mockAnalysisDetail.fileName}</Text>
          <Text style={styles.dateTime}>
            {formatDate(mockAnalysisDetail.date)} at {mockAnalysisDetail.time}
          </Text>
          
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Spending</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(mockAnalysisDetail.totalSpending)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(mockAnalysisDetail.totalIncome)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Savings</Text>
              <Text style={[styles.summaryValue, styles.savingsValue]}>
                {formatCurrency(mockAnalysisDetail.savings)}
              </Text>
            </View>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          <BarChart
            data={chartData}
            width={Dimensions.get('window').width - 48}
            height={220}
            yAxisLabel="$"
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={styles.chart}
            showBarTops={false}
            fromZero
            withInnerLines={false}
            withOuterLines={true}
            withHorizontalLabels={true}
            withVerticalLabels={true}
            withDots={false}
            withShadow={false}
            segments={5}
            yAxisInterval={1}
          />
        </View>

        {/* Transactions Section */}
        <View style={styles.transactionsCard}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {mockAnalysisDetail.transactions.map((transaction, index) => (
            <View key={index} style={styles.transactionItem}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>
                  {transaction.description}
                </Text>
                <Text style={styles.transactionCategory}>
                  {transaction.category}
                </Text>
              </View>
              <Text style={[
                styles.transactionAmount,
                transaction.amount < 0 ? styles.negativeAmount : styles.positiveAmount
              ]}>
                {formatCurrency(transaction.amount)}
              </Text>
            </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
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
    shadowRadius: 3,
    elevation: 3,
  },
  fileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  savingsValue: {
    color: '#4CAF50',
  },
  chartCard: {
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
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  transactionsCard: {
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
    shadowRadius: 3,
    elevation: 3,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  negativeAmount: {
    color: '#FF6B6B',
  },
  positiveAmount: {
    color: '#4CAF50',
  },
});

export default AnalysisDetailScreen; 