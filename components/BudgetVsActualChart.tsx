'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getCategoryColor } from '@/lib/categories';

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

interface BudgetVsActualChartProps {
  transactions: Transaction[];
  budgets: Budget[];
  selectedMonth: string;
  isLoading?: boolean;
}

export default function BudgetVsActualChart({ 
  transactions, 
  budgets, 
  selectedMonth, 
  isLoading = false 
}: BudgetVsActualChartProps) {
  const processData = () => {
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

    // Create comparison data
    const comparisonData = budgets.map(budget => {
      const actual = actualSpending[budget.category] || 0;
      const remaining = budget.amount - actual;
      const percentage = budget.amount > 0 ? (actual / budget.amount) * 100 : 0;

      return {
        category: budget.category,
        budget: Math.round(budget.amount * 100) / 100,
        actual: Math.round(actual * 100) / 100,
        remaining: Math.round(remaining * 100) / 100,
        percentage: Math.round(percentage * 100) / 100,
        color: getCategoryColor(budget.category)
      };
    });

    return comparisonData.sort((a, b) => b.actual - a.actual);
  };

  const data = processData();
  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0);
  const totalActual = data.reduce((sum, item) => sum + item.actual, 0);
  const totalRemaining = totalBudget - totalActual;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (budgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No budgets set for this month</p>
            <p className="text-sm">Set some budgets to see the comparison</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual ({selectedMonth})</CardTitle>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>Total Budget: ${totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          <span>Total Spent: ${totalActual.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          <span className={totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}>
            Remaining: ${totalRemaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tickFormatter={(value) => `$${value}`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
                name
              ]}
              labelFormatter={(label) => `${label}`}
            />
            <Legend />
            <Bar 
              dataKey="budget" 
              fill="#3B82F6" 
              name="Budget"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="actual" 
              fill="#EF4444" 
              name="Actual"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Budget breakdown table */}
        <div className="mt-6">
          <h4 className="font-semibold mb-3">Budget Breakdown</h4>
          <div className="space-y-2">
            {data.map((item) => (
              <div key={item.category} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="font-medium">{item.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    Budget: ${item.budget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-gray-600">
                    Actual: ${item.actual.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className={`text-sm font-medium ${item.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.remaining >= 0 ? '+' : ''}${item.remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className={`text-xs ${item.percentage > 100 ? 'text-red-600' : 'text-green-600'}`}>
                    {item.percentage}% of budget
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 