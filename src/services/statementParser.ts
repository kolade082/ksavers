import * as FileSystem from 'expo-file-system';
import { AnalysisResult, Transaction, Category, Insight } from '../types/analysis';
import * as DocumentPicker from 'expo-document-picker';
import { PDFParser } from './pdfParser';

// Common spending categories and their keywords
const CATEGORIES = {
  'Food & Dining': [
    'restaurant', 'food', 'dining', 'cafe', 'coffee', 'grocery', 'supermarket', 
    'takeout', 'delivery', 'uber eats', 'doordash', 'grubhub', 'starbucks', 
    'mcdonalds', 'subway', 'pizza', 'burger', 'sandwich', 'salad'
  ],
  'Transportation': [
    'uber', 'lyft', 'taxi', 'transit', 'parking', 'fuel', 'gas', 'metro', 
    'subway', 'bus', 'amtrak', 'airline', 'flight', 'airport', 'parking meter'
  ],
  'Shopping': [
    'amazon', 'walmart', 'target', 'store', 'shop', 'retail', 'marketplace', 
    'mall', 'best buy', 'costco', 'home depot', 'ikea', 'nike', 'adidas', 
    'clothing', 'apparel', 'electronics', 'furniture'
  ],
  'Bills & Utilities': [
    'electric', 'water', 'gas', 'internet', 'phone', 'rent', 'mortgage', 
    'insurance', 'subscription', 'verizon', 'comcast', 'spectrum', 'netflix', 
    'spotify', 'hulu', 'disney+', 'utility', 'cable', 'internet'
  ],
  'Entertainment': [
    'netflix', 'spotify', 'movie', 'theater', 'concert', 'sports', 'gym', 
    'fitness', 'streaming', 'youtube', 'twitch', 'steam', 'playstation', 
    'xbox', 'nintendo', 'game', 'gaming', 'ticketmaster', 'eventbrite'
  ],
  'Healthcare': [
    'pharmacy', 'doctor', 'medical', 'health', 'dental', 'hospital', 'clinic', 
    'prescription', 'cvs', 'walgreens', 'rite aid', 'insurance', 'copay', 
    'deductible', 'pharmacy', 'drugstore', 'medical center'
  ],
  'Education': [
    'school', 'university', 'college', 'course', 'training', 'textbook', 
    'tuition', 'campus', 'student', 'academic', 'library', 'bookstore', 
    'courseware', 'online learning', 'udemy', 'coursera'
  ],
  'Travel': [
    'hotel', 'airline', 'flight', 'booking', 'airbnb', 'resort', 'vacation', 
    'expedia', 'hotels.com', 'kayak', 'priceline', 'tripadvisor', 'cruise', 
    'tour', 'travel agency', 'visa', 'passport'
  ],
  'Other': [],
};

// Spending thresholds for insights
const INSIGHT_THRESHOLDS = {
  HIGH_FOOD_SPENDING: 25, // percentage
  LOW_SAVINGS_RATE: 0.2, // 20%
  HIGH_ENTERTAINMENT: 15, // percentage
  LARGE_PURCHASES: 500, // dollars
  FREQUENT_SMALL_PURCHASES: 15, // number of transactions
  SMALL_PURCHASE_THRESHOLD: 5, // dollars
  UNUSUAL_SPENDING_CHANGE: 20, // percentage
};

export class BankStatementParser {
  private static instance: BankStatementParser;
  private constructor() {}

  static getInstance(): BankStatementParser {
    if (!BankStatementParser.instance) {
      BankStatementParser.instance = new BankStatementParser();
    }
    return BankStatementParser.instance;
  }

  async parseStatement(fileUri: string): Promise<AnalysisResult> {
    try {
      const fileType = this.getFileType(fileUri);
      let transactions: Transaction[] = [];

      if (fileType === 'pdf') {
        // Use the new PDF parser
        try {
          transactions = await PDFParser.parsePDF(fileUri);
        } catch (error) {
          console.warn('Server PDF parsing failed, falling back to local parsing');
          transactions = await PDFParser.parsePDFLocally(fileUri);
        }
      } else if (fileType === 'csv') {
        // Handle CSV files
        const content = await FileSystem.readAsStringAsync(fileUri);
        transactions = await this.parseCSVTransactions(content);
      } else {
        throw new Error('Unsupported file type');
      }
      
      // Categorize transactions
      const categorizedTransactions = transactions.map(transaction => ({
        ...transaction,
        category: this.categorizeTransaction(transaction),
      }));

      // Calculate totals and categories
      const categories = this.calculateCategories(categorizedTransactions);
      const totalSpending = this.calculateTotalSpending(categorizedTransactions);
      const totalIncome = this.calculateTotalIncome(categorizedTransactions);
      
      // Generate insights
      const insights = this.generateInsights(categorizedTransactions, categories, totalSpending, totalIncome);

      // Extract period from transactions
      const period = this.extractPeriod(categorizedTransactions);

      return {
        totalSpending,
        totalIncome,
        netChange: totalIncome - totalSpending,
        categories,
        insights,
        period,
        transactions: categorizedTransactions,
      };
    } catch (error) {
      console.error('Error parsing statement:', error);
      throw new Error('Failed to parse bank statement');
    }
  }

  private getFileType(fileUri: string): string {
    const extension = fileUri.split('.').pop()?.toLowerCase() || '';
    return extension;
  }

  private generateMockTransactions(): Transaction[] {
    const transactions: Transaction[] = [];
    const now = new Date();
    
    // Generate transactions for the last 90 days
    for (let i = 0; i < 90; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Generate 1-5 transactions per day
      const numTransactions = Math.floor(Math.random() * 5) + 1;
      
      for (let j = 0; j < numTransactions; j++) {
        const type = Math.random() > 0.9 ? 'credit' : 'debit';
        let amount: number;
        let description: string;

        if (type === 'credit') {
          // Generate realistic credit amounts (salary, refunds, etc.)
          if (Math.random() > 0.7) {
            // Salary deposit (usually on specific days)
            amount = 3000 + Math.random() * 2000;
            description = 'Salary Deposit';
          } else if (Math.random() > 0.5) {
            // Refund
            amount = 20 + Math.random() * 200;
            description = 'Refund - ' + this.generateMockDescription('debit');
          } else {
            // Transfer in
            amount = 100 + Math.random() * 500;
            description = 'Transfer In';
          }
        } else {
          // Generate realistic debit amounts based on category
          const category = this.getRandomCategory();
          amount = this.generateRealisticAmount(category);
          description = this.generateRealisticDescription(category, amount);
        }
        
        transactions.push({
          date: date.toISOString(),
          description,
          amount: type === 'credit' ? amount : -amount,
          type,
        });
      }
    }
    
    return transactions;
  }

  private getRandomCategory(): string {
    const categories = Object.keys(CATEGORIES);
    return categories[Math.floor(Math.random() * categories.length)];
  }

  private generateRealisticAmount(category: string): number {
    const ranges: Record<string, { min: number; max: number }> = {
      'Food & Dining': { min: 5, max: 150 },
      'Transportation': { min: 2, max: 100 },
      'Shopping': { min: 10, max: 500 },
      'Bills & Utilities': { min: 50, max: 1000 },
      'Entertainment': { min: 5, max: 200 },
      'Healthcare': { min: 10, max: 300 },
      'Education': { min: 20, max: 1000 },
      'Travel': { min: 100, max: 2000 },
    };

    const range = ranges[category] || { min: 5, max: 200 };
    return range.min + Math.random() * (range.max - range.min);
  }

  private generateRealisticDescription(category: string, amount: number): string {
    const keywords = CATEGORIES[category as keyof typeof CATEGORIES];
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    
    // Add some variety to descriptions
    const prefixes = ['Payment to', 'Purchase at', 'Transaction at', 'Charge from'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    // Add location or additional details
    const locations = ['Downtown', 'Online', 'Store #1234', 'Branch #5678'];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    return `${prefix} ${keyword} ${location}`;
  }

  private async parseCSVTransactions(content: string): Promise<Transaction[]> {
    // This is a simplified implementation that generates mock data
    // In a real app, you would implement proper CSV parsing here
    const transactions: Transaction[] = [];
    const now = new Date();
    
    // Generate mock transactions for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Generate 1-3 transactions per day
      const numTransactions = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < numTransactions; j++) {
        const amount = Math.random() * 200;
        const type = Math.random() > 0.8 ? 'credit' : 'debit';
        const description = this.generateMockDescription(type);
        
        transactions.push({
          date: date.toISOString(),
          description,
          amount: type === 'credit' ? amount : -amount,
          type,
        });
      }
    }
    
    return transactions;
  }

  private generateMockDescription(type: 'credit' | 'debit'): string {
    const creditDescriptions = [
      'Salary Deposit',
      'Interest Credit',
      'Refund',
      'Transfer In',
    ];
    
    const debitDescriptions = [
      'Grocery Store',
      'Restaurant',
      'Gas Station',
      'Online Shopping',
      'Utility Bill',
      'Entertainment',
      'Healthcare',
      'Education',
      'Transportation',
    ];
    
    const descriptions = type === 'credit' ? creditDescriptions : debitDescriptions;
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private categorizeTransaction(transaction: Transaction): string {
    const description = transaction.description.toLowerCase();
    
    for (const [category, keywords] of Object.entries(CATEGORIES)) {
      if (keywords.some(keyword => description.includes(keyword))) {
        return category;
      }
    }
    
    return 'Other';
  }

  private calculateCategories(transactions: Transaction[]): Category[] {
    const categoryMap = new Map<string, Transaction[]>();
    
    // Group transactions by category
    transactions.forEach(transaction => {
      const category = transaction.category || 'Other';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)?.push(transaction);
    });

    // Calculate total spending for percentage calculation
    const totalSpending = this.calculateTotalSpending(transactions);

    // Convert to Category array
    return Array.from(categoryMap.entries()).map(([name, transactions]) => {
      const amount = transactions.reduce((sum, t) => sum + t.amount, 0);
      return {
        name,
        amount,
        percentage: (amount / totalSpending) * 100,
        transactions,
      };
    });
  }

  private calculateTotalSpending(transactions: Transaction[]): number {
    return Math.abs(transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0));
  }

  private calculateTotalIncome(transactions: Transaction[]): number {
    return transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  private generateInsights(
    transactions: Transaction[],
    categories: Category[],
    totalSpending: number,
    totalIncome: number
  ): Insight[] {
    const insights: Insight[] = [];

    // Analyze food spending
    const foodCategory = categories.find(c => c.name === 'Food & Dining');
    if (foodCategory && foodCategory.percentage > INSIGHT_THRESHOLDS.HIGH_FOOD_SPENDING) {
      insights.push({
        title: 'High Food Spending',
        description: `Your food spending is ${Math.round(foodCategory.percentage)}% of your total spending. Consider meal planning or reducing takeout orders.`,
        icon: 'restaurant-menu',
        color: '#FF6B6B',
        type: 'alert',
      });
    }

    // Analyze savings
    const savingsRate = (totalIncome - totalSpending) / totalIncome;
    if (savingsRate < INSIGHT_THRESHOLDS.LOW_SAVINGS_RATE) {
      insights.push({
        title: 'Low Savings Rate',
        description: `Your current savings rate is ${Math.round(savingsRate * 100)}%. Try to save at least 20% of your income.`,
        icon: 'account-balance',
        color: '#4CAF50',
        type: 'savings',
      });
    }

    // Analyze entertainment spending
    const entertainmentCategory = categories.find(c => c.name === 'Entertainment');
    if (entertainmentCategory && entertainmentCategory.percentage > INSIGHT_THRESHOLDS.HIGH_ENTERTAINMENT) {
      insights.push({
        title: 'High Entertainment Spending',
        description: `Your entertainment spending is ${Math.round(entertainmentCategory.percentage)}% of your total spending. Look for free or low-cost alternatives.`,
        icon: 'movie',
        color: '#FF9800',
        type: 'alert',
      });
    }

    // Analyze large purchases
    const largePurchases = transactions.filter(t => 
      t.type === 'debit' && Math.abs(t.amount) > INSIGHT_THRESHOLDS.LARGE_PURCHASES
    );
    if (largePurchases.length > 0) {
      const totalLargePurchases = largePurchases.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      insights.push({
        title: 'Large Purchases Detected',
        description: `You made ${largePurchases.length} purchases over $${INSIGHT_THRESHOLDS.LARGE_PURCHASES}, totaling $${Math.round(totalLargePurchases)}.`,
        icon: 'warning',
        color: '#FFC107',
        type: 'alert',
      });
    }

    // Analyze frequent small purchases
    const smallPurchases = transactions.filter(t => 
      t.type === 'debit' && Math.abs(t.amount) < INSIGHT_THRESHOLDS.SMALL_PURCHASE_THRESHOLD
    );
    if (smallPurchases.length > INSIGHT_THRESHOLDS.FREQUENT_SMALL_PURCHASES) {
      const totalSmallPurchases = smallPurchases.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      insights.push({
        title: 'Frequent Small Purchases',
        description: `You made ${smallPurchases.length} purchases under $${INSIGHT_THRESHOLDS.SMALL_PURCHASE_THRESHOLD}, totaling $${Math.round(totalSmallPurchases)}. These can add up quickly!`,
        icon: 'shopping-cart',
        color: '#9C27B0',
        type: 'spending',
      });
    }

    // Analyze spending trends
    const recentSpending = this.calculateRecentSpending(transactions);
    const previousSpending = this.calculatePreviousSpending(transactions);
    const spendingChange = ((recentSpending - previousSpending) / previousSpending) * 100;

    if (Math.abs(spendingChange) > INSIGHT_THRESHOLDS.UNUSUAL_SPENDING_CHANGE) {
      insights.push({
        title: spendingChange > 0 ? 'Spending Increased' : 'Spending Decreased',
        description: `Your spending has ${spendingChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(Math.round(spendingChange))}% compared to the previous period.`,
        icon: spendingChange > 0 ? 'trending-up' : 'trending-down',
        color: spendingChange > 0 ? '#F44336' : '#4CAF50',
        type: 'trend',
      });
    }

    // Add positive insights for good financial habits
    if (savingsRate >= 0.3) {
      insights.push({
        title: 'Excellent Savings Rate',
        description: `You're saving ${Math.round(savingsRate * 100)}% of your income! Keep up the great work!`,
        icon: 'star',
        color: '#FFD700',
        type: 'savings',
      });
    }

    return insights;
  }

  private calculateRecentSpending(transactions: Transaction[]): number {
    const now = new Date();
    const twoWeeksAgo = new Date(now.setDate(now.getDate() - 14));
    return Math.abs(transactions
      .filter(t => new Date(t.date) > twoWeeksAgo && t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0));
  }

  private calculatePreviousSpending(transactions: Transaction[]): number {
    const now = new Date();
    const fourWeeksAgo = new Date(now.setDate(now.getDate() - 28));
    const twoWeeksAgo = new Date(now.setDate(now.getDate() - 14));
    return Math.abs(transactions
      .filter(t => 
        new Date(t.date) > fourWeeksAgo && 
        new Date(t.date) <= twoWeeksAgo && 
        t.type === 'debit'
      )
      .reduce((sum, t) => sum + t.amount, 0));
  }

  private extractPeriod(transactions: Transaction[]): { start: string; end: string } {
    if (transactions.length === 0) {
      return { start: '', end: '' };
    }

    const dates = transactions.map(t => new Date(t.date));
    return {
      start: new Date(Math.min(...dates.map(d => d.getTime()))).toISOString(),
      end: new Date(Math.max(...dates.map(d => d.getTime()))).toISOString(),
    };
  }
} 