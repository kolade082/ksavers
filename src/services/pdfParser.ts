import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { Transaction } from '../types/analysis';

export class PDFParser {
  private static getServerUrl(): string {
    // Use IP address for all platforms in development
    return 'http://192.168.0.210:3000';
  }

  private static readonly API_ENDPOINT = `${PDFParser.getServerUrl()}/pdf-parse`;

  static async parsePDF(fileUri: string): Promise<Transaction[]> {
    try {
      console.log('Starting PDF parsing process...');
      
      // Read the PDF file as base64
      console.log('Reading PDF file...');
      const base64Data = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log('PDF file read successfully');

      const serverUrl = this.getServerUrl();
      const endpoint = `${serverUrl}/pdf-parse`;
      console.log('Sending request to:', endpoint);

      // Send the PDF data to the server for parsing
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfData: base64Data,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response not OK:', response.status, errorText);
        throw new Error(`Failed to parse PDF: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Received response from server');
      
      if (!data.transactions) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format from server');
      }

      const transactions = this.processParsedData(data);
      console.log(`Successfully processed ${transactions.length} transactions`);
      return transactions;
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Failed to parse bank statement');
    }
  }

  private static processParsedData(data: any): Transaction[] {
    // Process the parsed data from the server
    // This will depend on the format of data returned by your server
    return data.transactions.map((t: any) => ({
      date: new Date(t.date).toISOString(),
      description: t.description,
      amount: parseFloat(t.amount),
      type: t.type,
    }));
  }

  // Fallback method for when server parsing fails
  static async parsePDFLocally(fileUri: string): Promise<Transaction[]> {
    try {
      // For now, we'll generate mock data as a fallback
      // In a production app, you would want to implement proper PDF parsing
      // or encourage users to export their statements as CSV
      return this.generateMockTransactions();
    } catch (error) {
      console.error('Error parsing PDF locally:', error);
      throw new Error('Failed to parse bank statement');
    }
  }

  private static generateMockTransactions(): Transaction[] {
    const transactions: Transaction[] = [];
    const now = new Date();
    
    // Generate transactions for the last 30 days
    for (let i = 0; i < 30; i++) {
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

  private static getRandomCategory(): string {
    const categories = [
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Bills & Utilities',
      'Entertainment',
      'Healthcare',
      'Education',
      'Travel',
      'Other'
    ];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  private static generateRealisticAmount(category: string): number {
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

  private static generateRealisticDescription(category: string, amount: number): string {
    const keywords: Record<string, string[]> = {
      'Food & Dining': ['restaurant', 'food', 'dining', 'cafe', 'coffee', 'grocery', 'supermarket'],
      'Transportation': ['uber', 'lyft', 'taxi', 'transit', 'parking', 'fuel', 'gas'],
      'Shopping': ['amazon', 'walmart', 'target', 'store', 'shop', 'retail'],
      'Bills & Utilities': ['electric', 'water', 'gas', 'internet', 'phone', 'rent'],
      'Entertainment': ['netflix', 'spotify', 'movie', 'theater', 'concert', 'sports'],
      'Healthcare': ['pharmacy', 'doctor', 'medical', 'health', 'dental', 'hospital'],
      'Education': ['school', 'university', 'college', 'course', 'training', 'textbook'],
      'Travel': ['hotel', 'airline', 'flight', 'booking', 'airbnb', 'resort'],
    };

    const categoryKeywords = keywords[category] || ['transaction', 'payment', 'purchase'];
    const keyword = categoryKeywords[Math.floor(Math.random() * categoryKeywords.length)];
    
    const prefixes = ['Payment to', 'Purchase at', 'Transaction at', 'Charge from'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    const locations = ['Downtown', 'Online', 'Store #1234', 'Branch #5678'];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    return `${prefix} ${keyword} ${location}`;
  }

  private static generateMockDescription(type: 'credit' | 'debit'): string {
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
} 