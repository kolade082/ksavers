export type Transaction = {
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category?: string;
};

export type Category = {
  name: string;
  amount: number;
  percentage: number;
  transactions: Transaction[];
};

export type AnalysisResult = {
  totalSpending: number;
  totalIncome: number;
  netChange: number;
  categories: Category[];
  insights: Insight[];
  period: {
    start: string;
    end: string;
  };
};

export type Insight = {
  title: string;
  description: string;
  icon: string;
  color: string;
  type: 'spending' | 'savings' | 'trend' | 'alert';
};

export type StatementParser = {
  parseStatement: (fileUri: string) => Promise<AnalysisResult>;
  categorizeTransaction: (transaction: Transaction) => string;
}; 