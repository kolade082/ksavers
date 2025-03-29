import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type HistoryScreenProps = NativeStackScreenProps<RootStackParamList, 'History'>;

// Mock data for past analyses
const mockAnalyses = [
  {
    id: '1',
    date: '2024-03-15',
    time: '14:30',
    fileName: 'Statement_March_2024.pdf',
    totalSpending: 2500,
    totalIncome: 3500,
    savings: 1000,
    topCategories: ['Food', 'Transport', 'Entertainment'],
  },
  {
    id: '2',
    date: '2024-02-28',
    time: '16:45',
    fileName: 'Statement_February_2024.pdf',
    totalSpending: 2300,
    totalIncome: 3500,
    savings: 1200,
    topCategories: ['Shopping', 'Food', 'Bills'],
  },
  {
    id: '3',
    date: '2024-01-31',
    time: '09:15',
    fileName: 'Statement_January_2024.pdf',
    totalSpending: 2800,
    totalIncome: 3500,
    savings: 700,
    topCategories: ['Bills', 'Food', 'Transport'],
  },
];

type SortOption = 'date' | 'savings' | 'spending';
type FilterOption = 'all' | 'high-savings' | 'low-savings';

const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState(false);
  const filterAnimation = new Animated.Value(0);
  const cardAnimations = mockAnalyses.map(() => new Animated.Value(0));

//   console.log('HistoryScreen rendered');
//   console.log('Mock analyses:', mockAnalyses);

  // Start card animations when component mounts
  React.useEffect(() => {
    cardAnimations.forEach((animation, index) => {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, []);

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

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    Animated.timing(filterAnimation, {
      toValue: showFilters ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const sortAnalyses = (analyses: typeof mockAnalyses) => {
    return [...analyses].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'savings':
          return b.savings - a.savings;
        case 'spending':
          return b.totalSpending - a.totalSpending;
        default:
          return 0;
      }
    });
  };

  const filterAnalyses = (analyses: typeof mockAnalyses) => {
    switch (filterBy) {
      case 'high-savings':
        return analyses.filter(analysis => analysis.savings > 1000);
      case 'low-savings':
        return analyses.filter(analysis => analysis.savings <= 1000);
      default:
        return analyses;
    }
  };

  const filteredAndSortedAnalyses = filterAnalyses(sortAnalyses(mockAnalyses));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis History</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={toggleFilters}
        >
          <MaterialIcons name="filter-list" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.filterContainer,
          {
            maxHeight: filterAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 120],
            }),
            opacity: filterAnimation,
          },
        ]}
      >
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Sort By</Text>
          <View style={styles.filterOptions}>
            <TouchableOpacity
              style={[styles.filterOption, sortBy === 'date' && styles.filterOptionActive]}
              onPress={() => setSortBy('date')}
            >
              <Text style={[styles.filterOptionText, sortBy === 'date' && styles.filterOptionTextActive]}>
                Date
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterOption, sortBy === 'savings' && styles.filterOptionActive]}
              onPress={() => setSortBy('savings')}
            >
              <Text style={[styles.filterOptionText, sortBy === 'savings' && styles.filterOptionTextActive]}>
                Savings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterOption, sortBy === 'spending' && styles.filterOptionActive]}
              onPress={() => setSortBy('spending')}
            >
              <Text style={[styles.filterOptionText, sortBy === 'spending' && styles.filterOptionTextActive]}>
                Spending
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Filter By</Text>
          <View style={styles.filterOptions}>
            <TouchableOpacity
              style={[styles.filterOption, filterBy === 'all' && styles.filterOptionActive]}
              onPress={() => setFilterBy('all')}
            >
              <Text style={[styles.filterOptionText, filterBy === 'all' && styles.filterOptionTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterOption, filterBy === 'high-savings' && styles.filterOptionActive]}
              onPress={() => setFilterBy('high-savings')}
            >
              <Text style={[styles.filterOptionText, filterBy === 'high-savings' && styles.filterOptionTextActive]}>
                High Savings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterOption, filterBy === 'low-savings' && styles.filterOptionActive]}
              onPress={() => setFilterBy('low-savings')}
            >
              <Text style={[styles.filterOptionText, filterBy === 'low-savings' && styles.filterOptionTextActive]}>
                Low Savings
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <ScrollView style={styles.container}>
        {filteredAndSortedAnalyses.map((analysis, index) => (
          <Animated.View
            key={analysis.id}
            style={[
              styles.analysisCard,
              {
                transform: [{
                  translateY: cardAnimations[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                }],
                opacity: cardAnimations[index],
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('AnalysisDetail', { analysisId: analysis.id })}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.fileName}>{analysis.fileName}</Text>
                  <Text style={styles.dateTime}>
                    {formatDate(analysis.date)} at {analysis.time}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#666" />
              </View>

              <View style={styles.summaryContainer}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Spending</Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(analysis.totalSpending)}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Income</Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(analysis.totalIncome)}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Savings</Text>
                  <Text style={[styles.summaryValue, styles.savingsValue]}>
                    {formatCurrency(analysis.savings)}
                  </Text>
                </View>
              </View>

              <View style={styles.categoriesContainer}>
                <Text style={styles.categoriesLabel}>Top Categories:</Text>
                <View style={styles.categoriesList}>
                  {analysis.topCategories.map((category, index) => (
                    <View key={index} style={styles.categoryTag}>
                      <Text style={styles.categoryText}>{category}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
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
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  filterButton: {
    padding: 4,
  },
  filterContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    overflow: 'hidden',
  },
  filterSection: {
    padding: 12,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  filterOptionActive: {
    backgroundColor: '#2196F3',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#666',
  },
  filterOptionTextActive: {
    color: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  analysisCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    color: '#666',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  savingsValue: {
    color: '#4CAF50',
  },
  categoriesContainer: {
    marginTop: 8,
  },
  categoriesLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
});

export default HistoryScreen; 