import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Food & Dining',
      'Transportation',
      'Entertainment',
      'Shopping',
      'Healthcare',
      'Utilities',
      'Housing',
      'Education',
      'Travel',
      'Other'
    ]
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0, 'Budget amount must be positive']
  },
  month: {
    type: String,
    required: [true, 'Month is required'],
    // Format: YYYY-MM (e.g., "2024-01")
    match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format']
  },
  year: {
    type: Number,
    required: [true, 'Year is required']
  }
}, {
  timestamps: true
});

// Create compound index for unique budget per category per month
budgetSchema.index({ category: 1, month: 1 }, { unique: true });
budgetSchema.index({ year: 1, month: 1 });

const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);

export default Budget; 