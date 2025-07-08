'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { getCategoryColor } from '@/lib/categories';
import BudgetForm from './BudgetForm';

interface Budget {
  _id: string;
  category: string;
  amount: number;
  month: string;
}

interface BudgetManagerProps {
  budgets: Budget[];
  onAdd: (budget: Omit<Budget, '_id'>) => void;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function BudgetManager({ 
  budgets, 
  onAdd, 
  onEdit, 
  onDelete, 
  isLoading = false 
}: BudgetManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const handleSubmit = async (budgetData: Omit<Budget, '_id'>) => {
    setIsSubmitting(true);
    try {
      if (editingBudget) {
        await onEdit({ ...budgetData, _id: editingBudget._id });
        toast.success('Budget updated successfully');
      } else {
        await onAdd(budgetData);
        toast.success('Budget set successfully');
      }
      handleCloseForm();
    } catch (error) {
      toast.error('Failed to save budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      try {
        await onDelete(id);
        toast.success('Budget deleted successfully');
      } catch (error) {
        toast.error('Failed to delete budget');
      }
    }
  };

  const handleAdd = () => {
    setEditingBudget(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingBudget(null);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const filteredBudgets = budgets.filter(budget => budget.month === selectedMonth);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Management</CardTitle>
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

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Budget Management</CardTitle>
          <Button onClick={handleAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Set Budget
          </Button>
        </CardHeader>
        <CardContent>
          {/* Month Selector */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Select Month
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          {filteredBudgets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No budgets set for {formatMonth(selectedMonth)}</p>
              <p className="text-sm">Set your first budget to start tracking</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBudgets.map((budget) => (
                <div
                  key={budget._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getCategoryColor(budget.category) }}
                    ></div>
                    <div>
                      <div className="font-medium">{budget.category}</div>
                      <div className="text-sm text-gray-500">
                        {formatMonth(budget.month)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-600">
                      {formatAmount(budget.amount)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(budget)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(budget._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingBudget ? 'Edit Budget' : 'Set Monthly Budget'}
            </DialogTitle>
          </DialogHeader>
          <BudgetForm
            budget={editingBudget || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </>
  );
} 