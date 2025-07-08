'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  type: 'expense' | 'income';
  category: string;
}

interface Budget {
  _id: string;
  category: string;
  amount: number;
  month: string;
}

interface Warning {
  type: 'over-budget' | 'near-budget';
  category: string;
  message: string;
  amount: number;
}

interface Insight {
  type: 'under-budget' | 'frequent-category' | 'monthly-change';
  category?: string;
  message: string;
  amount?: number;
  change?: number;
}

interface Recommendation {
  type: 'high-average';
  message: string;
}

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
  selectedMonth: string;
  isLoading?: boolean;
}

export default function SpendingInsights({ 
  transactions, 
  budgets, 
  selectedMonth, 
  isLoading = false 
}: SpendingInsightsProps) {
  const generateInsights = () => {
    // Filter transactions for the selected month
    const monthTransactions = transactions.filter(transaction => {
      if (transaction.type !== 'expense') return false;
      const transactionMonth = new Date(transaction.date).toISOString().slice(0, 7);
      return transactionMonth === selectedMonth;
    });

    // Calculate actual spending by category
    const actualSpending: { [key: string]: number } = {};
    monthTransactions.forEach(transaction => {
      actualSpending[transaction.category] = (actualSpending[transaction.category] || 0) + transaction.amount;
    });

    // Generate insights
    const insights: Insight[] = [];
    const warnings: Warning[] = [];
    const recommendations: Recommendation[] = [];

    // Budget analysis
    budgets.forEach(budget => {
      const actual = actualSpending[budget.category] || 0;
      const percentage = budget.amount > 0 ? (actual / budget.amount) * 100 : 0;
      const remaining = budget.amount - actual;

      if (percentage > 100) {
        warnings.push({
          type: 'over-budget',
          category: budget.category,
          message: `You've exceeded your ${budget.category} budget by ${Math.round(percentage - 100)}%`,
          amount: Math.abs(remaining)
        });
      } else if (percentage > 80) {
        warnings.push({
          type: 'near-budget',
          category: budget.category,
          message: `You're close to your ${budget.category} budget limit (${Math.round(percentage)}%)`,
          amount: remaining
        });
      } else if (percentage < 50 && actual > 0) {
        insights.push({
          type: 'under-budget',
          category: budget.category,
          message: `Great job staying under budget for ${budget.category}!`,
          amount: remaining
        });
      }
    });

    // Spending patterns
    const totalSpent = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
    const avgTransaction = totalSpent / monthTransactions.length || 0;

    if (avgTransaction > 100) {
      recommendations.push({
        type: 'high-average',
        message: `Your average transaction is $${avgTransaction.toFixed(2)}. Consider smaller, more frequent purchases.`
      });
    }

    // Category analysis
    const categoryCounts: { [key: string]: number } = {};
    monthTransactions.forEach(transaction => {
      categoryCounts[transaction.category] = (categoryCounts[transaction.category] || 0) + 1;
    });

    const mostFrequentCategory = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)[0];

    if (mostFrequentCategory) {
      insights.push({
        type: 'frequent-category',
        category: mostFrequentCategory[0],
        message: `${mostFrequentCategory[0]} is your most frequent spending category (${mostFrequentCategory[1]} transactions)`
      });
    }

    // Monthly comparison (if we have previous month data)
    const currentMonth = new Date(selectedMonth + '-01');
    const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const previousMonthStr = previousMonth.toISOString().slice(0, 7);
    
    const previousMonthTransactions = transactions.filter(transaction => {
      if (transaction.type !== 'expense') return false;
      const transactionMonth = new Date(transaction.date).toISOString().slice(0, 7);
      return transactionMonth === previousMonthStr;
    });

    const previousMonthTotal = previousMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
    const change = totalSpent - previousMonthTotal;
    const changePercentage = previousMonthTotal > 0 ? (change / previousMonthTotal) * 100 : 0;

    if (Math.abs(changePercentage) > 20) {
      insights.push({
        type: 'monthly-change',
        message: `Your spending ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(changePercentage).toFixed(1)}% compared to last month`,
        change: change
      });
    }

    return {
      insights,
      warnings,
      recommendations,
      totalSpent,
      change,
      changePercentage
    };
  };

  const data = generateInsights();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (budgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Set up budgets to get personalized insights</p>
            <p className="text-sm">We'll analyze your spending patterns and provide recommendations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
        <p className="text-sm text-gray-500">
          Analysis for {selectedMonth} • Total spent: ${data.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Warnings */}
        {data.warnings.length > 0 && (
          <div>
            <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Budget Warnings
            </h4>
            <div className="space-y-2">
              {data.warnings.map((warning, index) => (
                <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{warning.message}</p>
                  <p className="text-xs text-red-600 mt-1">
                    {warning.type === 'over-budget' ? 'Over budget by' : 'Remaining'} ${Math.abs(warning.amount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        {data.insights.length > 0 && (
          <div>
            <h4 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Insights
            </h4>
            <div className="space-y-2">
              {data.insights.map((insight, index) => (
                <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">{insight.message}</p>
                  {insight.amount && (
                    <p className="text-xs text-blue-600 mt-1">
                      {insight.type === 'under-budget' ? 'Under budget by' : 'Change'} ${Math.abs(insight.amount).toFixed(2)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {data.recommendations.length > 0 && (
          <div>
            <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Recommendations
            </h4>
            <div className="space-y-2">
              {data.recommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">{rec.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly comparison */}
        {Math.abs(data.changePercentage) > 5 && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2">
              {data.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-red-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-600" />
              )}
              <span className="text-sm font-medium">
                {data.change > 0 ? 'Spending increased' : 'Spending decreased'} by {Math.abs(data.changePercentage).toFixed(1)}% from last month
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {data.change > 0 ? '+' : ''}${data.change.toFixed(2)} difference
            </p>
          </div>
        )}

        {data.warnings.length === 0 && data.insights.length === 0 && data.recommendations.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p>Great job managing your budget this month!</p>
            <p className="text-sm">Keep up the good work with your spending habits.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 