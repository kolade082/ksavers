import { MaterialIcons } from '@expo/vector-icons';

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

export interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category?: string;
}

export interface Category {
  name: string;
  amount: number;
  percentage: number;
  transactions: Transaction[];
}

export interface Insight {
  title: string;
  description: string;
  icon: MaterialIconName;
  color: string;
  type: 'spending' | 'savings' | 'trend' | 'alert';
}

export interface AnalysisResult {
  totalSpending: number;
  totalIncome: number;
  netChange: number;
  categories: Category[];
  insights: Insight[];
  period: {
    start: string;
    end: string;
  };
  transactions: Transaction[];
}

export type StatementParser = {
  parseStatement: (fileUri: string) => Promise<AnalysisResult>;
  categorizeTransaction: (transaction: Transaction) => string;
}; 