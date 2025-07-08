'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export default function MonthlyExpensesChart({ transactions, isLoading = false }: MonthlyExpensesChartProps) {
  const processData = () => {
    const monthlyData: { [key: string]: number } = {};
    
    // Get current year
    const currentYear = new Date().getFullYear();
    
    // Initialize all months with 0
    for (let month = 0; month < 12; month++) {
      const date = new Date(currentYear, month, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      monthlyData[monthKey] = 0;
    }
    
    // Process transactions
    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        const date = new Date(transaction.date);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
        monthlyData[monthKey] += transaction.amount;
      }
    });
    
    // Convert to array format for Recharts
    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount: Math.round(amount * 100) / 100 // Round to 2 decimal places
    }));
  };

  const data = processData();
  const totalExpenses = data.reduce((sum, item) => sum + item.amount, 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No expense data available</p>
            <p className="text-sm">Add some expenses to see the chart</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses ({new Date().getFullYear()})</CardTitle>
        <p className="text-sm text-gray-500">
          Total: ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `$${value}`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Amount']}
              labelFormatter={(label) => `${label} ${new Date().getFullYear()}`}
            />
            <Bar 
              dataKey="amount" 
              fill="#ef4444" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 