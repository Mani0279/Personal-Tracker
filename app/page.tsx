'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/sonner';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import MonthlyExpensesChart from '@/components/MonthlyExpensesChart';
import CategoryPieChart from '@/components/CategoryPieChart';
import DashboardSummary from '@/components/DashboardSummary';
import { toast } from 'sonner';

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  type: 'expense' | 'income';
  category: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data);
      setDbError(null);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      setDbError(error.message || 'Database connection failed');
      toast.error('Failed to load transactions. Please check your database connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Handle form submission
  const handleSubmit = async (transactionData: Omit<Transaction, '_id'>) => {
    setIsSubmitting(true);
    try {
      const url = editingTransaction 
        ? `/api/transactions/${editingTransaction._id}`
        : '/api/transactions';
      
      const method = editingTransaction ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save transaction');
      }

      const savedTransaction = await response.json();
      
      if (editingTransaction) {
        setTransactions(prev => 
          prev.map(t => t._id === editingTransaction._id ? savedTransaction : t)
        );
        toast.success('Transaction updated successfully');
      } else {
        setTransactions(prev => [savedTransaction, ...prev]);
        toast.success('Transaction added successfully');
      }
      
      handleCloseForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete transaction');
      
      setTransactions(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      throw error;
    }
  };

  // Handle edit
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  // Handle add new
  const handleAdd = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  // Handle close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  // Retry database connection
  const handleRetry = () => {
    setIsLoading(true);
    setDbError(null);
    fetchTransactions();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Personal Finance Visualizer
          </h1>
          <p className="text-gray-600">
            Track your expenses and income with detailed analytics and category insights
          </p>
        </div>

        {dbError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-red-800 font-medium">Database Connection Error</h3>
                <p className="text-red-600 text-sm mt-1">{dbError}</p>
                <p className="text-red-600 text-sm mt-1">
                  Please make sure MongoDB is running and the connection string is correct.
                </p>
              </div>
              <Button onClick={handleRetry} variant="outline" size="sm">
                Retry Connection
              </Button>
            </div>
          </div>
        )}

        {/* Dashboard Summary */}
        <div className="mb-8">
          <DashboardSummary 
            transactions={transactions} 
            isLoading={isLoading} 
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <MonthlyExpensesChart 
            transactions={transactions} 
            isLoading={isLoading} 
          />
          <CategoryPieChart 
            transactions={transactions} 
            isLoading={isLoading} 
          />
        </div>

        {/* Transactions Section */}
        <div className="space-y-6">
          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            isLoading={isLoading}
          />
        </div>

        {/* Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
              </DialogTitle>
            </DialogHeader>
            <TransactionForm
              transaction={editingTransaction || undefined}
              onSubmit={handleSubmit}
              onCancel={handleCloseForm}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>

        {/* Toast Notifications */}
        <Toaster />
      </div>
    </div>
  );
}
