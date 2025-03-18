import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalysisResult } from '../types/analysis';

const STORAGE_KEYS = {
  ANALYSIS_HISTORY: 'analysis_history',
  LAST_ANALYSIS: 'last_analysis',
};

export class StorageService {
  private static instance: StorageService;
  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async saveAnalysis(analysis: AnalysisResult): Promise<void> {
    try {
      // Save as last analysis
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_ANALYSIS,
        JSON.stringify(analysis)
      );

      // Add to history
      const history = await this.getAnalysisHistory();
      history.unshift({
        ...analysis,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      });
      
      // Keep only last 10 analyses
      const trimmedHistory = history.slice(0, 10);
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.ANALYSIS_HISTORY,
        JSON.stringify(trimmedHistory)
      );
    } catch (error) {
      console.error('Error saving analysis:', error);
      throw new Error('Failed to save analysis');
    }
  }

  async getLastAnalysis(): Promise<AnalysisResult | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_ANALYSIS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting last analysis:', error);
      return null;
    }
  }

  async getAnalysisHistory(): Promise<(AnalysisResult & { id: string; timestamp: string })[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ANALYSIS_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting analysis history:', error);
      return [];
    }
  }

  async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ANALYSIS_HISTORY,
        STORAGE_KEYS.LAST_ANALYSIS,
      ]);
    } catch (error) {
      console.error('Error clearing history:', error);
      throw new Error('Failed to clear history');
    }
  }
} 