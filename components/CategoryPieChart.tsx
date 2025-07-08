'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getCategoryColor } from '@/lib/categories';

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  type: 'expense' | 'income';
  category: string;
}

interface CategoryPieChartProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export default function CategoryPieChart({ transactions, isLoading = false }: CategoryPieChartProps) {
  const processData = () => {
    const categoryData: { [key: string]: number } = {};
    
    // Process only expense transactions
    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        categoryData[transaction.category] = (categoryData[transaction.category] || 0) + transaction.amount;
      }
    });
    
    // Convert to array format for Recharts
    return Object.entries(categoryData)
      .map(([category, amount]) => ({
        name: category,
        value: Math.round(amount * 100) / 100,
        color: getCategoryColor(category)
      }))
      .sort((a, b) => b.value - a.value); // Sort by amount descending
  };

  const data = processData();
  const totalExpenses = data.reduce((sum, item) => sum + item.value, 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
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
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No expense data available</p>
            <p className="text-sm">Add some expenses to see the category breakdown</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No expense categories found</p>
            <p className="text-sm">Add some expenses to see the category breakdown</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <p className="text-sm text-gray-500">
          Total Expenses: ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Amount']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Category breakdown list */}
        <div className="mt-4 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span>{item.name}</span>
              </div>
              <span className="font-medium">
                ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 