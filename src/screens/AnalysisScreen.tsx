import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  TouchableOpacity,
  Share,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AnalysisResult, Insight } from '../types/analysis';
import { BankStatementParser } from '../services/statementParser';
import { StorageService } from '../services/storage';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { PieChart, LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

type AnalysisScreenRouteProp = RouteProp<RootStackParamList, 'Analysis'>;

const CHART_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', 
  '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#1ABC9C'
];

const CHART_CONFIG = {
  pie: {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: 'bold',
    },
  },
  line: {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: 'bold',
    },
  },
};

export default function AnalysisScreen() {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const route = useRoute<AnalysisScreenRouteProp>();

  useEffect(() => {
    analyzeStatement();
  }, []);

  const analyzeStatement = async () => {
    try {
      setLoading(true);
      if (!route.params?.fileUri) {
        throw new Error('No file URI provided');
      }
      const parser = BankStatementParser.getInstance();
      const result = await parser.parseStatement(route.params.fileUri);
      setAnalysis(result);
      
      // Save analysis results
      const storage = StorageService.getInstance();
      await storage.saveAnalysis(result);
    } catch (error) {
      Alert.alert(
        'Analysis Error',
        'Failed to analyze your bank statement. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!analysis) return;

    try {
      const report = generateReport(analysis);
      await Share.share({
        message: report,
        title: 'Spending Analysis Report',
      });
    } catch (error) {
      Alert.alert('Export Error', 'Failed to export analysis report');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Analyzing your statement...</Text>
      </View>
    );
  }

  if (!analysis) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#FF6B6B" />
        <Text style={styles.errorText}>Failed to load analysis</Text>
      </View>
    );
  }

  // Process data for pie chart
  const pieChartData = analysis.categories.map((category, index) => ({
    name: category.name,
    spending: Math.abs(category.amount),
    color: CHART_COLORS[index % CHART_COLORS.length],
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
    legendFontWeight: 'bold',
  }));

  // Process data for line chart
  const processLineChartData = () => {
    const dailySpending = new Map<string, number>();
    const startDate = new Date(analysis.period.start);
    const endDate = new Date(analysis.period.end);

    // Initialize all dates in the period with 0
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dailySpending.set(d.toISOString().split('T')[0], 0);
    }

    // Sum up spending for each day
    analysis.transactions.forEach(transaction => {
      const date = transaction.date.split('T')[0];
      if (dailySpending.has(date)) {
        dailySpending.set(date, dailySpending.get(date)! + Math.abs(transaction.amount));
      }
    });

    // Convert to array and sort by date
    const sortedData = Array.from(dailySpending.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([_, amount]) => amount);

    // Group data into weeks
    const weeklyData = [];
    for (let i = 0; i < sortedData.length; i += 7) {
      const weekTotal = sortedData.slice(i, i + 7).reduce((sum, amount) => sum + amount, 0);
      weeklyData.push(weekTotal);
    }

    return {
      labels: weeklyData.map((_, i) => `Week ${i + 1}`),
      datasets: [
        {
          data: weeklyData,
          color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };

  const lineChartData = processLineChartData();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Spending Analysis</Text>
          <TouchableOpacity onPress={handleExport} style={styles.exportButton}>
            <MaterialIcons name="share" size={24} color="#2196F3" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>
          {new Date(analysis.period.start).toLocaleDateString()} -{' '}
          {new Date(analysis.period.end).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Spending</Text>
        <Text style={styles.amount}>${analysis.totalSpending.toFixed(2)}</Text>
        <Text style={styles.netChange}>
          Net Change: ${analysis.netChange.toFixed(2)}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spending by Category</Text>
        <View style={styles.chartContainer}>
          <PieChart
            data={pieChartData}
            width={width - 40}
            height={220}
            chartConfig={CHART_CONFIG.pie}
            accessor="spending"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            hasLegend={true}
            center={[10, 10]}
            avoidFalseZero={true}
            style={styles.chart}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Spending Trend</Text>
        <View style={styles.chartContainer}>
          <LineChart
            data={lineChartData}
            width={Dimensions.get('window').width - 48}
            height={220}
            chartConfig={CHART_CONFIG.line}
            bezier
            style={styles.chart}
            withDots={true}
            withInnerLines={true}
            withOuterLines={true}
            withVerticalLines={true}
            withHorizontalLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            withShadow={false}
            segments={4}
            fromZero={true}
            yAxisLabel="$"
            yAxisInterval={1}
            xAxisLabel=""
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category Breakdown</Text>
        {analysis.categories.map((category) => (
          <View key={category.name} style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryAmount}>
                ${category.amount.toFixed(2)}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { 
                    width: `${category.percentage}%`,
                    backgroundColor: getCategoryColor(category.name),
                  },
                ]}
              />
            </View>
            <Text style={styles.percentage}>
              {category.percentage.toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Insights</Text>
        {analysis.insights.map((insight, index) => (
          <View key={index} style={styles.insightCard}>
            <MaterialIcons
              name={insight.icon as any}
              size={24}
              color={insight.color}
            />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightDescription}>
                {insight.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    'Food & Dining': '#FF6B6B',
    'Transportation': '#4ECDC4',
    'Shopping': '#45B7D1',
    'Bills & Utilities': '#96CEB4',
    'Entertainment': '#FFEEAD',
    'Healthcare': '#D4A5A5',
    'Education': '#9B59B6',
    'Travel': '#3498DB',
    'Other': '#95A5A6',
  };
  return colors[category] || '#95A5A6';
}

function generateReport(analysis: AnalysisResult): string {
  const date = new Date().toLocaleDateString();
  const period = `${new Date(analysis.period.start).toLocaleDateString()} - ${new Date(analysis.period.end).toLocaleDateString()}`;
  
  let report = `Spending Analysis Report\n`;
  report += `Generated on: ${date}\n`;
  report += `Period: ${period}\n\n`;
  
  report += `Total Spending: $${analysis.totalSpending.toFixed(2)}\n`;
  report += `Total Income: $${analysis.totalIncome.toFixed(2)}\n`;
  report += `Net Change: $${analysis.netChange.toFixed(2)}\n\n`;
  
  report += `Spending by Category:\n`;
  analysis.categories.forEach(category => {
    report += `${category.name}: $${category.amount.toFixed(2)} (${category.percentage.toFixed(1)}%)\n`;
  });
  
  report += `\nKey Insights:\n`;
  analysis.insights.forEach(insight => {
    report += `• ${insight.title}: ${insight.description}\n`;
  });
  
  return report;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FF6B6B',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  netChange: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
  },
  categoryAmount: {
    fontSize: 16,
    color: '#666',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  insightContent: {
    marginLeft: 12,
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  insightDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  exportButton: {
    padding: 8,
  },
}); 