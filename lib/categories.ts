export const categories = {
  // Expense categories
  'Food & Dining': { color: '#FF6B6B', type: 'expense' },
  'Transportation': { color: '#4ECDC4', type: 'expense' },
  'Entertainment': { color: '#45B7D1', type: 'expense' },
  'Shopping': { color: '#96CEB4', type: 'expense' },
  'Healthcare': { color: '#FFEAA7', type: 'expense' },
  'Utilities': { color: '#DDA0DD', type: 'expense' },
  'Housing': { color: '#98D8C8', type: 'expense' },
  'Education': { color: '#F7DC6F', type: 'expense' },
  'Travel': { color: '#BB8FCE', type: 'expense' },
  'Other': { color: '#A9A9A9', type: 'expense' },
  
  // Income categories
  'Salary': { color: '#2ECC71', type: 'income' },
  'Freelance': { color: '#3498DB', type: 'income' },
  'Investment': { color: '#F39C12', type: 'income' },
  'Gift': { color: '#E74C3C', type: 'income' }
};

export const expenseCategories = Object.entries(categories)
  .filter(([_, config]) => config.type === 'expense')
  .map(([name, config]) => ({ name, color: config.color }));

export const incomeCategories = Object.entries(categories)
  .filter(([_, config]) => config.type === 'income')
  .map(([name, config]) => ({ name, color: config.color }));

export const allCategories = Object.entries(categories).map(([name, config]) => ({ 
  name, 
  color: config.color, 
  type: config.type 
}));

export function getCategoryColor(categoryName: string): string {
  return categories[categoryName as keyof typeof categories]?.color || '#A9A9A9';
}

export function getCategoriesByType(type: 'expense' | 'income') {
  return type === 'expense' ? expenseCategories : incomeCategories;
} 