# Personal Finance Visualizer

A modern web application for tracking personal finances with detailed analytics, categories, and budget management.

## Features

### Stage 1: Basic Transaction Tracking ✅
- Add, edit, and delete transactions (amount, date, description)
- Transaction list view with sorting
- Monthly expenses bar chart
- Basic form validation
- Responsive design

### Stage 2: Categories ✅
- Predefined categories for transactions (Food & Dining, Transportation, Entertainment, etc.)
- Category-wise pie chart showing spending breakdown
- Dashboard with summary cards:
  - Total income and expenses
  - Current balance
  - Total transaction count
  - Recent transactions list
- Dynamic category selection based on transaction type
- Color-coded categories for better visualization

### Stage 3: Budgeting ✅
- Set monthly category budgets with easy management interface
- Budget vs actual comparison chart with detailed breakdown
- Spending insights and recommendations:
  - Budget warnings (over-budget, near-budget alerts)
  - Spending pattern analysis
  - Monthly comparison insights
  - Personalized recommendations
- Month selector for historical budget tracking
- Real-time budget tracking and alerts

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Database**: MongoDB with Mongoose
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd personalexpencetracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/personal-finance
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding Transactions
1. Click "Add Transaction" button
2. Select transaction type (Expense or Income)
3. Choose a category from the predefined list
4. Fill in the amount, description, and date
5. Click "Add" to save

### Setting Budgets
1. Go to the "Budget Management" section
2. Click "Set Budget" button
3. Select a category and month
4. Enter your monthly budget amount
5. Click "Set Budget" to save

### Categories Available

**Expense Categories:**
- Food & Dining
- Transportation
- Entertainment
- Shopping
- Healthcare
- Utilities
- Housing
- Education
- Travel
- Other

**Income Categories:**
- Salary
- Freelance
- Investment
- Gift

### Dashboard Features
- **Summary Cards**: View total income, expenses, balance, and transaction count
- **Monthly Chart**: Track spending patterns over time
- **Category Breakdown**: See spending distribution by category
- **Recent Transactions**: Quick view of latest transactions
- **Budget Management**: Set and manage monthly category budgets
- **Budget vs Actual**: Compare planned vs actual spending
- **Spending Insights**: Get personalized recommendations and warnings

### Budget Tracking
- **Budget Warnings**: Get alerts when approaching or exceeding budgets
- **Monthly Comparison**: See how your spending changes month-over-month
- **Category Analysis**: Identify your most frequent spending categories
- **Recommendations**: Receive personalized spending advice

### Editing and Deleting
- **Transactions**: Click edit/delete icons to modify or remove transactions
- **Budgets**: Use the budget manager to edit or delete monthly budgets
- **Real-time Updates**: All changes are reflected immediately across all charts

## Project Structure

```
personalexpencetracker/
├── app/
│   ├── api/
│   │   ├── transactions/     # Transaction API routes
│   │   └── budgets/          # Budget API routes
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page component
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── TransactionForm.tsx  # Transaction form component
│   ├── TransactionList.tsx  # Transaction list component
│   ├── MonthlyExpensesChart.tsx # Monthly chart component
│   ├── CategoryPieChart.tsx # Category breakdown chart
│   ├── DashboardSummary.tsx # Dashboard summary cards
│   ├── BudgetForm.tsx       # Budget form component
│   ├── BudgetManager.tsx    # Budget management interface
│   ├── BudgetVsActualChart.tsx # Budget comparison chart
│   └── SpendingInsights.tsx # Spending insights component
├── lib/
│   ├── db.ts               # Database connection
│   ├── categories.ts       # Category configuration
│   └── utils.ts            # Utility functions
├── models/
│   ├── Transaction.ts      # Transaction MongoDB schema
│   └── Budget.ts           # Budget MongoDB schema
└── public/                 # Static assets
```

## API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction
- `GET /api/transactions/[id]` - Get a specific transaction
- `PUT /api/transactions/[id]` - Update a transaction
- `DELETE /api/transactions/[id]` - Delete a transaction

### Budgets
- `GET /api/budgets` - Get all budgets (with optional month/year filters)
- `POST /api/budgets` - Create a new budget
- `GET /api/budgets/[id]` - Get a specific budget
- `PUT /api/budgets/[id]` - Update a budget
- `DELETE /api/budgets/[id]` - Delete a budget

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
