import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import ThemedView from '../components/ThemedView';
import ThemedText from '../components/ThemedText';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type HistoryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'History'>;
};

// Mock data for demonstration
const mockHistory = [
  {
    id: '1',
    date: '2024-03-15',
    type: 'analysis',
    title: 'March Statement Analysis',
    amount: '£2,500',
    savings: '£500',
  },
  {
    id: '2',
    date: '2024-02-15',
    type: 'analysis',
    title: 'February Statement Analysis',
    amount: '£2,300',
    savings: '£450',
  },
  {
    id: '3',
    date: '2024-01-15',
    type: 'analysis',
    title: 'January Statement Analysis',
    amount: '£2,400',
    savings: '£480',
  },
];

const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <ThemedView useCard style={styles.header}>
          <View>
            <ThemedText variant="title">Analysis History</ThemedText>
            <ThemedText variant="caption">View your past statement analyses</ThemedText>
          </View>
        </ThemedView>

        {/* History List */}
        <ThemedView useCard style={styles.historyList}>
          {mockHistory.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.historyItem, { borderBottomColor: colors.border }]}
              onPress={() => navigation.navigate('Analysis', { fileUri: `mock-uri-${item.id}` })}
            >
              <View style={styles.historyItemHeader}>
                <View style={styles.historyItemTitle}>
                  <MaterialIcons name="analytics" size={24} color={colors.primary} />
                  <ThemedText variant="body" style={{ marginLeft: 12 }}>
                    {item.title}
                  </ThemedText>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.text} />
              </View>
              
              <View style={styles.historyItemDetails}>
                <View style={styles.historyItemDetail}>
                  <ThemedText variant="caption">Date</ThemedText>
                  <ThemedText>{formatDate(item.date)}</ThemedText>
                </View>
                <View style={styles.historyItemDetail}>
                  <ThemedText variant="caption">Total Spent</ThemedText>
                  <ThemedText>{item.amount}</ThemedText>
                </View>
                <View style={styles.historyItemDetail}>
                  <ThemedText variant="caption">Total Saved</ThemedText>
                  <ThemedText style={{ color: colors.success }}>{item.savings}</ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ThemedView>

        {/* Empty State */}
        {mockHistory.length === 0 && (
          <ThemedView useCard style={styles.emptyState}>
            <MaterialIcons name="history" size={48} color={colors.placeholder} />
            <ThemedText variant="subtitle" style={{ marginTop: 16 }}>
              No Analysis History
            </ThemedText>
            <ThemedText variant="caption" style={{ textAlign: 'center', marginTop: 8 }}>
              Upload your first bank statement to see your analysis history here.
            </ThemedText>
            <TouchableOpacity
              style={[styles.uploadButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('UploadStatement')}
            >
              <MaterialIcons name="cloud-upload" size={24} color="#fff" />
              <ThemedText style={styles.uploadButtonText}>Upload Statement</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
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
  },
  historyList: {
    marginTop: 20,
    padding: 20,
  },
  historyItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyItemTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyItemDetail: {
    flex: 1,
  },
  emptyState: {
    margin: 20,
    padding: 20,
    alignItems: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  uploadButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default HistoryScreen; 